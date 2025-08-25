import {
  Inject,
  Injectable,
  GatewayTimeoutException,
  BadGatewayException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout, catchError, throwError } from 'rxjs';
import {
  CreateVehicleParams,
  FindVehicleParams,
  UpdateVehicleParams,
  DeleteVehicleParams
} from '../_interfaces';

@Injectable()
export class VehiclesService {
  constructor(@Inject('VEHICLES_RMQ') private readonly client: ClientProxy) {}

  private async rpc<T>(pattern: string | object, data: unknown): Promise<T> {
    return lastValueFrom(
      this.client.send<T>(pattern, data).pipe(
        timeout(8000),
        catchError((err) => {
          if (err?.name === 'TimeoutError') {
            return throwError(() => new GatewayTimeoutException('Worker timeout'));
          }

          let statusCode: number | undefined;
          let message: string | undefined;

          if (err && typeof err === 'object') {
            if ('statusCode' in err) {
              statusCode = err.statusCode;
              message = err.message || 'Unknown error';
            }
            else if ('error' in err && typeof err.error === 'object') {
              const errorObj = err.error;
              if ('statusCode' in errorObj) {
                statusCode = errorObj.statusCode;
                message = errorObj.message || 'Unknown error';
              }
            }
          }

          if (statusCode !== undefined && message !== undefined) {
            switch (statusCode) {
              case 404:
                return throwError(() => new NotFoundException(message));
              default:
                return throwError(() => new BadGatewayException(message));
            }
          }

          return throwError(() => new BadGatewayException(
            err?.message || 'Worker error'
          ));
        }),
      ),
    );
  }

  async findAll() {
    return await this.rpc({ cmd: 'get-vehicles' }, {});
  }

  async findOne(payload: FindVehicleParams) {
    return await this.rpc({ cmd: 'get-vehicle' }, payload);
  }

  create(payload: CreateVehicleParams) {
    this.client.emit('create-vehicle', payload);
    return { message: "Vehicle data sent" };
  }

  async update(payload: UpdateVehicleParams) {
    return await this.rpc({ cmd: 'update-vehicle' }, payload);
  }

  remove(payload: DeleteVehicleParams) {
    this.client.emit('delete-vehicle', payload);
    return { message: "Delete request sent" };
  }
}