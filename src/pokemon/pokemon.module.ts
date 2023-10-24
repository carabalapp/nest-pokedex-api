import { Module } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([{
      name: Pokemon.name,
      schema: PokemonSchema
    }])
  ],
  exports: [
    // El MongooseModule podemos exportarlo de esta manera nada mas
    // No haria falta exportarlo de esta manera 
    // MongooseModule.forFeature([{
    //   name: Pokemon.name,
    //   schema: PokemonSchema
    // }])

    //  Debido a que ya tiene la configuracion que le colocamos en imports
    MongooseModule
  ]
})
export class PokemonModule {}
