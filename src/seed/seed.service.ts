import { Injectable } from '@nestjs/common';
// import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  // private readonly axios: AxiosInstance = axios;
  private readonly http: AxiosAdapter

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ){}


  async execSeed() {

    await this.pokemonModel.deleteMany();
    const data = await this.http.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);
    // const {data} = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);

    // const insertPromisesArray = [];
    // data.results.forEach(({name, url}) => {

    //   const segments = url.split('/');
    //   const no = +segments[segments.length-2];

    //   insertPromisesArray.push(this.pokemonModel.create({name, no}));
    // });

    // await Promise.all(insertPromisesArray);

    const pokemonToInsert: {name: string, no: number}[] = [];
    data.results.forEach(({name, url}) => {

      const segments = url.split('/');
      const no = +segments[segments.length-2];

      pokemonToInsert.push({name, no});
    });

    await this.pokemonModel.insertMany(pokemonToInsert);


    return 'Seed executed';
  }

}
