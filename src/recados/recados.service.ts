import { Injectable } from '@nestjs/common';
import { OutRecado } from './entities/recado.entity';
import { CreateRecadosDto } from './entities/create-recados.dto';

@Injectable()
export class RecadosService {
  private lastId = 1;
  private recados: OutRecado[] = [
    {
      id: String(this.lastId),
      texto: 'Primeiro recado',
      de: 'Alice',
      para: 'Bob',
      lido: false,
      data: new Date(),
    },
  ];

  findAll() {
    return this.recados;
  }

  findOne(id: string) {
    return this.recados.find((recado) => recado.id === String(+id));
  }

  create(recado: CreateRecadosDto) {
    this.lastId++;
    const id = String(this.lastId);
    const novoRecado = {
      id,
      ...recado,
      lido: false,
      data: new Date(),
    };
    this.recados.push(novoRecado);

    return novoRecado;
  }

  update(id: string, body: any) {
    const recadoExistenteIndex = this.recados.findIndex(
      (recado) => recado.id === String(+id)
    );

    if (recadoExistenteIndex >= 0) {
      const recadoExistente = this.recados[recadoExistenteIndex];

      this.recados[recadoExistenteIndex] = {
        ...recadoExistente,
        ...body,
      };
    }
  }

  remove(id: string) {
    const recadoExistenteIndex = this.recados.findIndex(
      (recado) => recado.id === String(+id)
    );

    if (recadoExistenteIndex >= 0) {
      this.recados.splice(recadoExistenteIndex, 1);
    }
  }
}
