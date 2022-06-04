const fs = require('fs');
const fsPromises = fs.promises;

module.exports = class Contenedor {
    constructor(name) {
        this.name = name;
    }

    async save(object) {

        let elements = await this.getAll();
        let newId;
        if (elements.length) {
            newId = elements[elements.length - 1].id + 1;
            elements.push({ id: newId, ...object });
            fsPromises.writeFile(`${this.name}.txt`, JSON.stringify(elements), null, 2)
                .then(_ => {
                    console.log('Archivo guardado exitosamente');
                })
                .catch(error => console.log(error));
        } else {
            newId = 1;
            fs.promises.writeFile(`${this.name}.txt`, JSON.stringify([{ id: newId, ...object }], null, 2))
                .then(_ => {
                    console.log('Archivo guardado exitosamente');
                    return 1;
                })
                .catch(error => console.log(error));
        }
        return newId;
    }

    async getById(id) {
        let elements = await this.getAll();
        let element = elements.find(element => element.id === id);
        if (element) {
            return element;
        } else {
            console.log('No se encontro elemento con el id indicado')
            return null;
        }
    }

    async getAll() {
        return await fsPromises.readFile(`${this.name}.txt`, 'utf8')
            .then(content => {
                if (content) {
                    return JSON.parse(content);
                } else {
                    return [];
                }
            })
            .catch(error => {
                if (error.code === 'ENOENT') {
                    console.log('El archivo no existe')
                } else {
                    console.log(error)
                }
                return [];
            });
    }

    async deleteById(id) {
        let elements = await this.getAll();
        let finalElements = [];
        if (elements) {
            for (const element of elements) {
                if (element.id != id) {
                    finalElements.push(element);
                }
            }
        }
        fsPromises.writeFile(`${this.name}.txt`, JSON.stringify(finalElements), null, 2)
            .then(console.log('Eliminado exitosamente'))
            .catch(error => console.log(error));
    }

    async deleteAll() {
        fsPromises.unlink(`${this.name}.txt`)
            .then(console.log('Todos los objetos fueron eliminados'))
            .catch(error => console.log(error));
    }
}