import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GuidGeneratorService {

  private readonly guidGeneratorApi: string = 'http://www.setgetgo.com/guid/get.php';

  constructor(private http: Http) { }

  /** Falls back to a pseudo random Guid if the webservice call fails */
  public async generateGuidFromWebservice(): Promise<string> {
    var guidGeneratorResponse = await this.http
      .get(this.guidGeneratorApi)
      .toPromise()
      .then(r => {
        var responseBody = r.text();
        if (responseBody.length === 38) {
          // The guid from the webservice is wrapped in curly braces
          return responseBody.substr(1, 36);
        }
        return null;
      }, () => {return null;}).catch(() => {return null;});
    if (!guidGeneratorResponse){
      return this.generatePseudoRandomGuid();
    }
    return guidGeneratorResponse;
  }

  /**
   * Taken from https://github.com/Steve-Fenton/TypeScriptUtilities/blob/master/Guid
   * (modified)
   * Generates a Version 4 (= Pseudorandom) Guid
   */
  public generatePseudoRandomGuid(): string {
    var newGuidPlaceholder = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
    var pseudoGuid = newGuidPlaceholder.replace(/[xy]/g, letter => this.generateRandomHexDigit(letter))
    return pseudoGuid;
  }

  private generateRandomHexDigit(letter: string): string {
    var r = Math.random() * 16 | 0;
    var v: number;
    if (letter === 'x'){
      v = r;
    } else if(letter === 'y') {
      v = r & 0x3 | 0x8;
       /*  r & 0x3 -> Allows either 0x0000, 0x0001, 0x0010 or 0x0011
       * | 0x8    -> 0x1000 = 8
       *             0x1001 = 9
       *             0x1010 = A
       *             0x1011 = B
       * The possible variants of version 4 Guids
       */

    } else {
      throw new Error('Please provide either "x" to indicate a random replacement or "y" to indicate the generation of the variant identifier');
    }
    return v.toString(16);
  }
}