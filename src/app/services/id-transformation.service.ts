import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdTransformationService {
  transformToNumber(id: any): number {
    return parseInt(id, 10);
  }

  transformObjectIds(obj: any): any {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (key.endsWith('Id') || key === 'id') {
            obj[key] = this.transformToNumber(obj[key]);
          }
          if (typeof obj[key] === 'object') {
            this.transformObjectIds(obj[key]);
          }
        }
      }
    }
    return obj;
  }
}
