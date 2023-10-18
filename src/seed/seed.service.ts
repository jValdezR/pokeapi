import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;


  async execSeed() {
    const {data} = await this.axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=650`);

    return data.results.forEach(({name, url}) => {

      const segments = url.split('/');
      const no = segments[segments.length-1];

      return {
        name,
        no
      }
    });
  }

}
