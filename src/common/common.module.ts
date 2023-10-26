import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
    // Aca colocamos el provider que tiene la logica y que injectaremos en otros modulos
    providers: [ AxiosAdapter ],
    // Aca colocamos la clase que queremos que sea visible y accesible para los otros modulos
    exports: [ AxiosAdapter ]
})
export class CommonModule {}
