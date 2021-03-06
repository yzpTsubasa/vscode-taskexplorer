
import {
    Task, TaskGroup, WorkspaceFolder, RelativePattern, ShellExecution, Uri,
    workspace, TaskProvider, TaskDefinition
} from "vscode";
import * as path from "path";
import * as util from "./util";
import { TaskItem } from "./tasks";
import { configuration } from "./common/configuration";
import { filesCache } from "./cache";


interface StringMap { [s: string]: string; }
let cachedTasks: Task[];


interface GruntTaskDefinition extends TaskDefinition
{
    script?: string;
    path?: string;
    fileName?: string;
    uri?: Uri;
    treeItem?: TaskItem;
}

export class GruntTaskProvider implements TaskProvider
{
    constructor() {}

    public provideTasks() {
        return provideGruntfiles();
    }

    public resolveTask(_task: Task): Task | undefined {
        return undefined;
    }
}


export async function invalidateTasksCacheGrunt(opt?: Uri): Promise<void>
{
    util.log("");
    util.log("invalidateTasksCacheGrunt");
    util.logValue("   uri", opt ? opt.path : (opt === null ? "null" : "undefined"), 2);
    util.logValue("   has cached tasks", cachedTasks ? "true" : "false", 2);

    if (opt && cachedTasks)
    {
        const rmvTasks: Task[] = [];

        await util.asyncForEach(cachedTasks, (each) => {
            const cstDef: GruntTaskDefinition = each.definition;
            if (cstDef.uri.fsPath === opt.fsPath || !util.pathExists(cstDef.uri.fsPath)) {
                rmvTasks.push(each);
            }
        });

        //
        // Technically this function can be called back into when waiting for a promise
        // to return on the asncForEach() above, and cachedTask array can be set to undefined,
        // this is happening with a broken await() somewere that I cannot find
        if (cachedTasks)
        {
            await util.asyncForEach(rmvTasks, (each) => {
                util.log("   removing old task " + each.name);
                util.removeFromArray(cachedTasks, each);
            });

            if (util.pathExists(opt.fsPath) && !util.existsInArray(configuration.get("exclude"), opt.path))
            {
                const tasks = await readGruntfile(opt);
                cachedTasks.push(...tasks);
            }

            if (cachedTasks.length > 0) {
                return;
            }
        }
    }

    cachedTasks = undefined;
}


async function provideGruntfiles(): Promise<Task[]>
{
    util.log("");
    util.log("provideGruntfiles");

    if (!cachedTasks) {
        cachedTasks = await detectGruntfiles();
    }
    return cachedTasks;
}


async function detectGruntfiles(): Promise<Task[]>
{
    util.log("");
    util.log("detectGruntfiles");

    const allTasks: Task[] = [];
    const visitedFiles: Set<string> = new Set();
    const paths = filesCache.get("grunt");

    if (workspace.workspaceFolders && paths)
    {
        for (const fobj of paths)
        {
            if (!util.isExcluded(fobj.uri.path) && !visitedFiles.has(fobj.uri.fsPath)) {
                visitedFiles.add(fobj.uri.fsPath);
                const tasks = await readGruntfile(fobj.uri);
                allTasks.push(...tasks);
            }
        }
    }

    util.logValue("   # of tasks", allTasks.length, 2);
    return allTasks;
}


async function readGruntfile(uri: Uri): Promise<Task[]>
{
    const result: Task[] = [];
    const folder = workspace.getWorkspaceFolder(uri);

    if (folder)
    {
        const scripts = await findTargets(uri.fsPath);
        if (scripts)
        {
            Object.keys(scripts).forEach(each => {
                const task = createGruntTask(each, `${each}`, folder!, uri);
                task.group = TaskGroup.Build;
                result.push(task);
            });
        }
    }

    return result;
}


async function findTargets(fsPath: string): Promise<StringMap>
{
    const json: any = "";
    const scripts: StringMap = {};

    util.log("");
    util.log("Find gruntfile targets");

    const contents = await util.readFile(fsPath);
    let idx = 0;
    let eol = contents.indexOf("\n", 0);

    while (eol !== -1)
    {
        let line: string = contents.substring(idx, eol).trim();
        if (line.length > 0 && line.toLowerCase().trimLeft().startsWith("grunt.registertask"))
        {
            let idx1 = line.indexOf("'");
            if (idx1 === -1) {
                idx1 = line.indexOf('"');
            }

            if (idx1 === -1) // check next line for task name
            {
                let eol2 = eol + 1;
                eol2 = contents.indexOf("\n", eol2);
                line = contents.substring(eol + 1, eol2).trim();
                if (line.startsWith("'") || line.startsWith('"'))
                {
                    idx1 = line.indexOf("'");
                    if (idx1 === -1) {
                        idx1 = line.indexOf('"');
                    }
                    if (idx1 !== -1) {
                        eol = eol2;
                    }
                }
            }

            if (idx1 !== -1)
            {
                idx1++;
                let idx2 = line.indexOf("'", idx1);
                if (idx2 === -1) {
                    idx2 = line.indexOf('"', idx1);
                }
                if (idx2 !== -1)
                {
                    const tgtName = line.substring(idx1, idx2).trim();

                    if (tgtName) {
                        scripts[tgtName] = "";
                        util.log("   found target");
                        util.logValue("      name", tgtName);
                    }
                }
            }
        }

        idx = eol + 1;
        eol = contents.indexOf("\n", idx);
    }

    util.log("   done");

    return scripts;
}


function createGruntTask(target: string, cmd: string, folder: WorkspaceFolder, uri: Uri): Task
{
    function getCommand(folder: WorkspaceFolder, cmd: string): string
    {
        // let grunt = 'folder.uri.fsPath + "/node_modules/.bin/grunt";
        const grunt = "grunt";
        // if (process.platform === 'win32') {
        //     grunt = folder.uri.fsPath + "\\node_modules\\.bin\\grunt.cmd";
        // }
        // if (workspace.getConfiguration('taskExplorer').get('pathToGrunt')) {
        //     grunt = workspace.getConfiguration('taskExplorer').get('pathToGrunt');
        // }
        return grunt;
    }

    function getRelativePath(folder: WorkspaceFolder, uri: Uri): string
    {
        if (folder) {
            const rootUri = folder.uri;
            const absolutePath = uri.path.substring(0, uri.path.lastIndexOf("/") + 1);
            return absolutePath.substring(rootUri.path.length + 1);
        }
        return "";
    }

    const kind: GruntTaskDefinition = {
        type: "grunt",
        script: target,
        path: getRelativePath(folder, uri),
        fileName: path.basename(uri.path),
        uri
    };

    const cwd = path.dirname(uri.fsPath);
    const args = [ getCommand(folder, cmd), target ];
    const options = {
        cwd
    };

    const execution = new ShellExecution("npx", args, options);

    return new Task(kind, folder, target, "grunt", execution, undefined);
}
