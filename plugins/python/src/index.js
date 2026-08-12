import * as fs from 'node:fs/promises';
import * as path from 'node:path';
export class PythonPlugin {
    name = 'python';
    async detect(projectDir, files) {
        const hasPyProject = files.includes('pyproject.toml');
        const hasReqs = files.includes('requirements.txt');
        const hasPipfile = files.includes('Pipfile');
        const hasMainPy = files.includes('main.py') || files.includes('app.py') || files.includes('manage.py');
        if (!hasPyProject && !hasReqs && !hasPipfile && !hasMainPy) {
            return { detected: false, confidence: 0, language: 'unknown' };
        }
        let fileContents = '';
        if (hasReqs) {
            try {
                fileContents += await fs.readFile(path.join(projectDir, 'requirements.txt'), 'utf-8');
            }
            catch { }
        }
        if (hasPyProject) {
            try {
                fileContents += await fs.readFile(path.join(projectDir, 'pyproject.toml'), 'utf-8');
            }
            catch { }
        }
        const lower = fileContents.toLowerCase();
        // Package manager detection
        let pm = 'pip';
        if (files.includes('poetry.lock') || lower.includes('[tool.poetry]'))
            pm = 'poetry';
        else if (files.includes('uv.lock') || lower.includes('[tool.uv]'))
            pm = 'uv';
        else if (files.includes('Pipfile') || files.includes('Pipfile.lock'))
            pm = 'pipenv';
        // Framework detection
        let framework = 'Python';
        let devCmd = 'python main.py';
        let port = 8000;
        if (lower.includes('fastapi') || files.includes('main.py')) {
            framework = 'FastAPI';
            devCmd = pm === 'poetry' ? 'poetry run uvicorn main:app --reload' : (pm === 'uv' ? 'uv run uvicorn main:app --reload' : 'uvicorn main:app --reload');
            port = 8000;
        }
        else if (lower.includes('django') || files.includes('manage.py')) {
            framework = 'Django';
            devCmd = pm === 'poetry' ? 'poetry run python manage.py runserver' : 'python manage.py runserver';
            port = 8000;
        }
        else if (lower.includes('flask')) {
            framework = 'Flask';
            devCmd = pm === 'poetry' ? 'poetry run flask run' : 'flask run';
            port = 5000;
        }
        else if (lower.includes('streamlit')) {
            framework = 'Streamlit';
            devCmd = pm === 'poetry' ? 'poetry run streamlit run app.py' : 'streamlit run app.py';
            port = 8501;
        }
        let installCmd = 'pip install -r requirements.txt';
        if (pm === 'poetry')
            installCmd = 'poetry install';
        else if (pm === 'uv')
            installCmd = 'uv sync';
        else if (pm === 'pipenv')
            installCmd = 'pipenv install';
        return {
            detected: true,
            confidence: 0.9,
            language: 'python',
            framework,
            packageManager: pm,
            entrypoints: [
                {
                    name: 'python-app',
                    path: files.includes('main.py') ? 'main.py' : (files.includes('app.py') ? 'app.py' : 'manage.py'),
                    type: 'api',
                    port,
                }
            ],
            commands: {
                install: installCmd,
                dev: devCmd,
                test: pm === 'poetry' ? 'poetry run pytest' : 'pytest',
            }
        };
    }
    async analyze(projectDir, manifest) {
        return manifest;
    }
    async healthCheck(projectDir, manifest) {
        const mainPort = manifest.ports[0] || 8000;
        return [
            {
                name: `${manifest.name || 'python'}-health`,
                type: 'http',
                target: `http://localhost:${mainPort}`,
                port: mainPort,
                path: '/',
                expectedStatus: 200,
            }
        ];
    }
}
//# sourceMappingURL=index.js.map