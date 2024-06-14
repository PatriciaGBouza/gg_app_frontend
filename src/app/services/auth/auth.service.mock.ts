import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { IApiResponse } from '../../interfaces/iapi-response';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceMock {
  private readonly mockToken = 'mock-token';
  private readonly mockRefreshToken = 'mock-refresh-token';

  getToken() {
    return this.mockToken;
  }

  refreshToken() {
    const response: IApiResponse<any> = {
      success: true,
      message: 'Token refreshed successfully',
      data: {
        accessToken: this.mockToken,
        refreshToken: this.mockRefreshToken
      }
    };
    return of(response);
  }

  isTokenExpired(token: string): boolean {
    return false;
  }

  logout(){
    console.log('Mock logout called');
  }
}
