'use strict';

var testUtils = require('../testUtils');
var dnsimple = require('../../lib/dnsimple')({
  accessToken: testUtils.getAccessToken(),
});

const expect = require('chai').expect;
const nock = require('nock');

describe('services', function() {
  describe('#listServices', function() {
    var fixture = testUtils.fixture('listServices/success.http');

    it('supports pagination', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/services?page=1')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({page: 1});

      endpoint.done();
      done();
    });

    it('supports extra request options', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/services?foo=bar')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({query: {foo: 'bar'}});

      endpoint.done();
      done();
    });

    it('supports sorting', function(done) {
      var endpoint = nock('https://api.dnsimple.com')
        .get('/v2/services?sort=name%3Aasc')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices({sort: 'name:asc'});

      endpoint.done();
      done();
    });

    it('produces a service list', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/services')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices().then(function(response) {
        var services = response.data;
        expect(services.length).to.eq(2);
        expect(services[0].name).to.eq('Service 1');
        expect(services[0].short_name).to.eq('service1');
        done();
      }, function(error) {
        done(error);
      });
    });

    it('exposes the pagination info', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/services')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.listServices().then(function(response) {
        var pagination = response.pagination;
        expect(pagination).to.not.be.null;
        expect(pagination.current_page).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });

  describe('#getService', function() {
    var fixture = testUtils.fixture('getService/success.http');

    it('produces a service', function(done) {
      nock('https://api.dnsimple.com')
        .get('/v2/services/name')
        .reply(fixture.statusCode, fixture.body);

      dnsimple.services.getService('name').then(function(response) {
        var service = response.data;
        expect(service.id).to.eq(1);
        done();
      }, function(error) {
        done(error);
      });
    });
  });
});
