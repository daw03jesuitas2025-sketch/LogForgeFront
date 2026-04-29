import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MessageService {
    private apiUrl = `https://${environment.apiUrl}/api`;
    
    constructor(private http: HttpClient) { }

    sendInterviewRequest(toUserId: number, text: string) {
        return this.http.post(`${this.apiUrl}/messages/interview`, {
            to_user_id: toUserId,
            message: text
        });
    }
    // el Candidato puede ver sus mensajes
    getMyMessages() {
        return this.http.get<any[]>(`${this.apiUrl}/messages/my-messages`);
    }
}