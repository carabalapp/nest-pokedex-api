import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

@Injectable()
export class SeedService {

    private readonly axios: AxiosInstance = axios

    constructor(
        @InjectModel(Pokemon.name)
        private readonly pokemonModel: Model<Pokemon>
    ) { }

    async executeSeed() {
        // Aca estabamos obteniendo un error de circular-json el cual nos daba este error en postman
        // {
        //     "statusCode": 500,
        //     "message": "Internal server error"
        // }
        // Todo se debia a que estaba escribiendo este codigo de esta manera

        // const response = await this.axios.get('https://pokeapi.co/api/v2/pokemon?limit=650')

        // return response

        // Lo que ocasionaba que me diera el error de circular JSON debido a que es un JSON muy grande y no sabe a cual propiedad acceder

        const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

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
