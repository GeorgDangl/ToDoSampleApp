import { async, inject, TestBed, withModule } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    Http,
    XHRBackend,
    Response, ResponseOptions,
    HttpModule
} from '@angular/http';

import { GuidGeneratorService } from './guid-generator.service';

// The following initializes the test environment for Angular 2. This call is required for Angular 2 dependency injection.
// That's new in Angular 2 RC5
TestBed.resetTestEnvironment();
TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());

describe('GuidGeneratorService', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: XHRBackend, useClass: MockBackend },
                GuidGeneratorService
            ],
            imports: [
                HttpModule
            ]
        });
    });

    it('can be instantiated via injector',
        withModule({
            providers: [
                GuidGeneratorService
            ]
        }, inject([GuidGeneratorService], (service: GuidGeneratorService) => {
            expect(service instanceof GuidGeneratorService).toBe(true);
        }))
    );

    it('can be instantiated with "new"', inject([Http], (http: Http) => {
        expect(http).not.toBeNull('http should be provided');
        let service = new GuidGeneratorService(http);
        expect(service instanceof GuidGeneratorService).toBe(true, 'new service should be ok');
    }));

    it('test suite can provide the mockBackend as XHRBackend',
        inject([XHRBackend], (backend: MockBackend) => {
            expect(backend).not.toBeNull('backend should be provided');
        }));

    describe('provides a Guid', () => {

        const properGuid = '83c6c27e-0b49-11e7-93ae-92361f002671';
        const invalidGuid = 'I\'m a cookie';

        let backend: MockBackend;
        let service: GuidGeneratorService;

        var stringIsGuid = (value: string) => {
            var guidRegexPattern = /^[{(]?[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}[)}]?$/g;
            var isProperGuid = guidRegexPattern.test(value);
            return isProperGuid;
        };

        beforeEach(inject([Http, XHRBackend], (http: Http, mockBackEnd: MockBackend) => {
            backend = mockBackEnd;
            service = new GuidGeneratorService(http);
        }));

        it('from the webservice', async(async () => {
            let options = new ResponseOptions({ status: 200, body: '{' + properGuid + '}'});
            var response = new Response(options);
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            await service.generateGuidFromWebservice()
                .then(guid => {
                    expect(guid).toBe(properGuid);
                });
        }));

        it('from itself when there is an error in the webservice', async(async () => {
            let options = new ResponseOptions({ status: 404 });
            var response = new Response(options);
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            await service.generateGuidFromWebservice()
                .then(guid => {
                    expect(guid).not.toBe(properGuid);
                    var resultIsGuid = stringIsGuid(guid);
                    expect(resultIsGuid).toBeTruthy();
                });
        }));
        
        it('from itself when the webservice doesn\'t return a Guid', async(async () => {
            let options = new ResponseOptions({ status: 200, body: invalidGuid });
            var response = new Response(options);
            backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
            var guid = await service.generateGuidFromWebservice();
            expect(guid).not.toBe(properGuid);
            var resultIsGuid = stringIsGuid(guid);
            expect(resultIsGuid).toBeTruthy();
        }));

        it('provides a pseudo random Guid without calling the webservice', () => {
            let options = new ResponseOptions({ status: 200, body: properGuid });
            var response = new Response(options);
            var hasCalledWebservice = false;
            backend.connections.subscribe((c: MockConnection) => {
                hasCalledWebservice = true;
                c.mockRespond(response);
            });
            var guid = service.generatePseudoRandomGuid();
            expect(hasCalledWebservice).toBeFalsy();
            expect(guid).not.toBe(properGuid);
            var resultIsGuid = stringIsGuid(guid);
            expect(resultIsGuid).toBeTruthy();
        });

    })
});