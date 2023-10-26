import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>,
        private readonly http: AxiosAdapter
    ) { }




    // Forma recomendada usando el metodo de de mongoose, insertMany()
    // Y solo le pasariamos un array de todos los objetos que vamos a insertar
    async executeSeed() {
        // Aca estabamos obteniendo un error de circular-json el cual nos daba este error en postman
        // {
        //     "statusCode": 500,
        //     "message": "Internal server error"
        // }
        // Todo se debia a que estaba escribiendo este codigo de esta manera
        
        // const response = await this.http.get('https://pokeapi.co/api/v2/pokemon?limit=650')
        
        // return response
        
        // Lo que ocasionaba que me diera el error de circular JSON debido a que es un JSON muy grande y no sabe a cual propiedad acceder
        await this.pokemonModel.deleteMany({})
        const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
        
        // Aca nosotros queremos guardar el "no" del pokemon en nuestra semilla, pero estamos obetiendo solo el name y el url
        // Pero en el url tenemos el no, solo debemos saber manejar la data para obtenerlo
        let pokemonsToInsert: {name: string, no: number}[] = []
        data.results.forEach(async ({ name, url }) => {
            const segments = url.split('/')
            // Aqui nos va arrojar un string pero necesitamops que sea de tipo number
            // Para eso le colocamos un '+' adelante y ya lo transforma en un tipo number
            const no = +segments[segments.length - 2]
        
            pokemonsToInsert.push({name, no})
        })

        const pokemonsInserted = await this.pokemonModel.insertMany(pokemonsToInsert)
        return `Seed executed, no of row inserts ${pokemonsInserted.length}`
        }


    // Haciendo pruebas me doy cuenta que esta forma tarda mas y es mas lenta que "executeSeedDeprecated1"
    // Posiblemente 3 veces mas lenta, ya que la respuesta de esta peticion ronda entre 900ms - 1100ms
    async executeSeedDeprecated2() {
        // Esto lo hacemos para borrar todo lo que tenemos en esa tabla
        // Esto es para que no nos de error de duplñicado al correr la semilla ya que podrian existir los mismmos registros
        // Esto es equivalente a un delete * from pokemons, asi que hay que tene cuidado con la tabla
        await this.pokemonModel.deleteMany({})
        // Aca estabamos obteniendo un error de circular-json el cual nos daba este error en postman
        // {
        //     "statusCode": 500,
        //     "message": "Internal server error"
        // }
        // Todo se debia a que estaba escribiendo este codigo de esta manera

        // const response = await this.http.get('https://pokeapi.co/api/v2/pokemon?limit=650')

        // return response

        // Lo que ocasionaba que me diera el error de circular JSON debido a que es un JSON muy grande y no sabe a cual propiedad acceder

        const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

        // Aca nosotros queremos guardar el "no" del pokemon en nuestra semilla, pero estamos obetiendo solo el name y el url
        // Pero en el url tenemos el no, solo debemos saber manejar la data para obtenerlo

        const insertPromiseArray = []
        data.results.forEach(({ name, url }) => {
            const segments = url.split('/')
            // Aqui nos va arrojar un string pero necesitamops que sea de tipo number
            // Para eso le colocamos un '+' adelante y ya lo transforma en un tipo number
            const no = +segments[segments.length - 2]

            insertPromiseArray.push(
                // Esto es una promesa y lña estamos insertando en nuestro array
                this.pokemonModel.create({ name, no })
            )
        });

        let noRowsInserts
        await Promise.all(insertPromiseArray)
            .then(resultados => {

                noRowsInserts = resultados.length
                // Se ejecuta cuando todas las promesas se resuelven correctamente
                // 'resultados' es un array con los resultados de cada promesa en el mismo orden
            })
            .catch(error => {
                // Se ejecuta si alguna de las promesas es rechazada
                // 'error' es el motivo del rechazo de la primera promesa que se rechaza
            });
        return `Seed executed, no of row inserts ${noRowsInserts}`
    }

    // Haciendo pruebas me doy cuenta que esta forma tarda menos y es mas rapida que "executeSeedDeprecated2"
    // Posiblemente 3 veces mas rapida, ya que la respuesta de esta peticion ronda entre 300ms - 400ms
    async executeSeedDeprecated1() {
    // Aca estabamos obteniendo un error de circular-json el cual nos daba este error en postman
    // {
    //     "statusCode": 500,
    //     "message": "Internal server error"
    // }
    // Todo se debia a que estaba escribiendo este codigo de esta manera
    
    // const response = await this.http.get('https://pokeapi.co/api/v2/pokemon?limit=650')
    
    // return response
    
    // Lo que ocasionaba que me diera el error de circular JSON debido a que es un JSON muy grande y no sabe a cual propiedad acceder
    await this.pokemonModel.deleteMany({})
    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')
    
    // Aca nosotros queremos guardar el "no" del pokemon en nuestra semilla, pero estamos obetiendo solo el name y el url
    // Pero en el url tenemos el no, solo debemos saber manejar la data para obtenerlo
    let noRows = 0
    data.results.forEach(async ({ name, url }) => {
        const segments = url.split('/')
        // Aqui nos va arrojar un string pero necesitamops que sea de tipo number
        // Para eso le colocamos un '+' adelante y ya lo transforma en un tipo number
        const no = +segments[segments.length - 2]
    
        noRows += 1;
        await this.pokemonModel.create({ name, no })
    })
    return `Seed executed, no of row inserts ${noRows}`
    }
    
}
