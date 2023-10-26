import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "../interfaces/http-adapters.interface";
import { Injectable } from '@nestjs/common';

// Al colocarlle este decorador, estamos haciendo que esta clase sea i jectable en cualquier modulo de nuestra aplicacion
@Injectable()
export class AxiosAdapter implements HttpAdapter {
    private axios: AxiosInstance = axios

    async get<T>(url: string): Promise<T> {
        try {
            const { data } = await this.axios.get<T>(url);
            return data
        } catch (error) {
            throw new Error('This is an error - Checks in logs');
        }
    }
    
}