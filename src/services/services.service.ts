import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    const service = this.servicesRepository.create(createServiceDto);
    return this.servicesRepository.save(service);
  }

  async findAll(): Promise<Service[]> {
    return this.servicesRepository.find();
  }

  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOneBy({ id });
    if (!service) {
      throw new NotFoundException(`Услуга с ID ${id} не найдена`);
    }
    return service;
  }

  async findByIds(ids: string[]): Promise<Service[]> {
    return this.servicesRepository.findBy({ id: In(ids) });
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    await this.servicesRepository.update(id, updateServiceDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.servicesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Услуга с ID ${id} не найдена`);
    }
  }
}
