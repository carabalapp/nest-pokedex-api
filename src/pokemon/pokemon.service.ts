import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  
  private defaultLimit: number
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly configService: ConfigService
  ) {  
    this.defaultLimit = this.configService.get('defaultLimit')
    console.log(this.defaultLimit)
  }


  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase()

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto)
      return pokemon;
    } catch (error) {
      this.handleExceptions( error )
    }

  }

  async findAll(paginationDto: PaginationDto) {

    let pokemons: Pokemon[]

    // Aqui decimos que si no viene limit u offser con un valor, entonces le asignamos por defecto los valores de abajo
    // Pero en dado caso de que si vengan, entonces tomaran el valor que traigan en el DTO
    const { limit = this.defaultLimit, offset = 0 } = paginationDto
    pokemons = await this.pokemonModel.find()
    .limit(limit)
    .skip(offset)

    if (!pokemons) throw new NotFoundException(`Not found pokemons`)

    return pokemons;
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    // Aqui recibo siempre el term ( en este caso puede ser el mongoId, no, o name) y para esta validacion digo, si es un numero entonces quiere decir que el termino ( term ) que me pasaron es el no
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    // Busqueda por mongoId, en este caso validamos con esta funcion de mongoose, si es o no un ID valido de mongo DB
    if (isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }


    // Busqueda por name, en dado caso que las 2 condiciones de arriba no se cumplan, quiere decir que no consiguio por "no", que no consiguio por "mongoId", y vamos a buscar por name.
    if (!pokemon) {
      // El term lo ponemos en minusculas con la funcion toLowercase y le quitamos los espacios al principio y al final en caso de que lo hayan colocado con la funcion trim()
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase().trim() })
    }

    //  En caso de que no existan pokemons bajo estos terminos o criterios.
    if (!pokemon) throw new NotFoundException(`Not found pokemon with this criterials mongoId, No or Name "${term}"`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    try {
      const pokemon = await this.findOne(term);
      if (updatePokemonDto.name) {
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();
      }
  
      await pokemon.updateOne(updatePokemonDto, { new: true })
  
      // En este fragmento de codigo se pasan 2 objetos, lo que hace es que se van a combinar ambos objetos y va retornar un solo objeto.
      // Pero el segundo objeto va a modificar el primero en las propiedades que coincidan
      return {...pokemon.toJSON(), ...updatePokemonDto};
      
    } catch (error) {
      this.handleExceptions( error )
    }
  }

  async remove(id: string) {

    //  Esta es una manera de borrar sin que retornemos el objeto o registro que borramos
    // let pokemonDelete = await this.pokemonModel.deleteOne( { _id: id} )

    // Esta es otra manera en la cual podemos devolver elñ objeto que borramos ya que muchas veces lo necesitaremos
    // Y hacerlo de esta manera estariamos haciendo solo una consulta a la BD
    let pokemonDelete = await this.pokemonModel.findByIdAndDelete( id )

    // Con esta logica estamos validando que si el query de arriba nos arroje un 200 OK aunque no consiga registros
    if ( !pokemonDelete ){
      throw new NotFoundException(`Not found this records with this id ${id}`)
    }

    return pokemonDelete;
  }

  private handleExceptions ( error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon property exist in DB ${JSON.stringify(error.keyValue)}`)
    }
    console.log(error)
    throw new InternalServerErrorException(`Can´t create pokemon - Chek server logs`)
  }
}
