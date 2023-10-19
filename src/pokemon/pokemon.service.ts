import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const {limit = 10, offset = 0} = paginationDto;
    return await this.pokemonModel.find()
    .limit(limit)
    .skip(offset)
    .sort({
      no:1
    })
    .select('-__v');
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }

    else if (isValidObjectId(term))
      pokemon = await this.pokemonModel.findById(term)

    else
      pokemon = await this.pokemonModel.findOne({ name: term })

    if (!pokemon)
      throw new NotFoundException(`Pokemon ${term} not found!`)

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {

    const pokemonDB = await this.findOne(term);



    try {

      await pokemonDB.updateOne(updatePokemonDto, { new: true });

      return { ...pokemonDB.toJSON(), ...updatePokemonDto };

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    
    // const result = await this.pokemonModel.findByIdAndDelete(id);

    const {deletedCount} = await this.pokemonModel.deleteOne({_id: id});
    if(deletedCount === 0)
      throw new BadRequestException(`Pokemon ${id} not found`);
    return 'deleted';
  }

  private handleExceptions(error: any) {
    if (error.code === 11000)
      throw new BadRequestException(`Pokemon exists! ${JSON.stringify(error.keyValue)}`)
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}

