import express from 'express';
import * as fs from 'fs/promises';
import * as path from 'path';

export default async function startServer(port: number, dataPath: string = 'routes'): Promise<express.Application> {
    const app = express();
    app.use(express.json());

    const routeFolders = await fs.readdir(path.join(__dirname, dataPath));

    for (const folder of routeFolders) {
        const routePath = `/${folder}`;
        const filePath = path.join(__dirname, dataPath, folder, 'data.json');
        let configPath = path.join(__dirname, dataPath, folder, 'config.json');
        let config = { methods: ['get', 'post', 'patch', 'delete'], idField: 'id' };

        try {
            const rawConfig = await fs.readFile(configPath, 'utf-8');
            config = { ...config, ...JSON.parse(rawConfig) };
        } catch (error: any) {
            if (error.code !== 'ENOENT') throw error;
        }

        const rawFileData = await fs.readFile(filePath, 'utf-8');
        const fileData = JSON.parse(rawFileData);

        if (config.methods.includes('get')) {
            app.get(routePath, (req, res) => {
                res.json(fileData);
            });
            console.log(`Registering GET ${routePath}`);
        }

        if (config.methods.includes('post')) {
            app.post(routePath, (req, res) => {
                const newItem = req.body;
                fileData.push(newItem);
                res.status(201).json(newItem);
            });
            console.log(`Registering POST ${routePath}`);
        }

        if (config.methods.includes('patch')) {
            app.patch(`${routePath}/:${config.idField}`, (req, res) => {
                const id = req.params[config.idField];

                // use weak comparison to coerce stringified numbers
                const index = fileData.findIndex((item:any) => item[config.idField] == id);
                if (index !== -1) {
                    fileData[index] = { ...fileData[index], ...req.body };
                    res.json(fileData[index]);
                } else {
                    res.status(404).send();
                }
            });
            console.log(`Registering PATCH ${routePath}/:${config.idField}`);
        }

        if (config.methods.includes('delete')) {
            app.delete(`${routePath}/:${config.idField}`, (req, res) => {
                const id = req.params[config.idField];
                // use weak comparison to coerce stringified numbers
                const index = fileData.findIndex((item:any) => item[config.idField] == id);
                if (index !== -1) {
                    fileData.splice(index, 1);
                    res.status(200).send();
                } else {
                    res.status(404).send();
                }
            });
            console.log(`Registering DELETE ${routePath}/:${config.idField}`);
        }
    }

        
    app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
    return app;
}
