sinon = require 'sinon'

describe 'n-installed', ->
  Given -> @node = ['0.10.21', '0.12.4', '4.1.1']
  Given -> @io = ['1.2.3', '2.0.1', '3.1.1']
  Given -> @all = ['0.10.21', '0.12.4', '1.2.3', '2.0.1', '3.1.1', '4.1.1']
  Given -> @fs =
    readdir: sinon.stub()
    readdirSync: sinon.stub()

  context 'with N_PREFIX set', ->
    Given -> @nprefix = process.env.N_PREFIX
    afterEach -> process.env.N_PREFIX = @prefix
    Given -> process.env.N_PREFIX = 'nprefix'
    Given -> @subject = require('proxyquire').noCallThru() '../lib/n-installed',
      fs: @fs

    describe 'sync', ->
      Given -> @fs.readdirSync.withArgs('nprefix/n/versions/node').returns @node
      Given -> @fs.readdirSync.withArgs('nprefix/n/versions/io').returns @io
      Then -> @subject().should.eql
        node: @node
        io: @io
        all: @all

    describe 'async', ->
      Given -> @fs.readdir.withArgs('nprefix/n/versions/node', sinon.match.func).callsArgWith 1, null, @node
      Given -> @fs.readdir.withArgs('nprefix/n/versions/io', sinon.match.func).callsArgWith 1, null, @io
      When (done) -> @subject( (err, @versions) => done() )
      Then -> @versions.should.eql
        node: @node
        io: @io
        all: @all

  context 'with N_PREFIX unset but with a path passed in', ->
    Given -> @nprefix = process.env.N_PREFIX
    afterEach -> process.env.N_PREFIX = @prefix
    Given -> delete process.env.N_PREFIX
    Given -> @subject = require('proxyquire').noCallThru() '../lib/n-installed',
      fs: @fs

    describe 'sync', ->
      Given -> @fs.readdirSync.withArgs('nprefix/n/versions/node').returns @node
      Given -> @fs.readdirSync.withArgs('nprefix/n/versions/io').returns @io
      Then -> @subject('nprefix').should.eql
        node: @node
        io: @io
        all: @all

    describe 'async', ->
      Given -> @fs.readdir.withArgs('nprefix/n/versions/node', sinon.match.func).callsArgWith 1, null, @node
      Given -> @fs.readdir.withArgs('nprefix/n/versions/io', sinon.match.func).callsArgWith 1, null, @io
      When (done) -> @subject('nprefix', (err, @versions) => done() )
      Then -> @versions.should.eql
        node: @node
        io: @io
        all: @all

  context 'with N_PREFIX unset and no path passed in', ->
    Given -> @nprefix = process.env.N_PREFIX
    afterEach -> process.env.N_PREFIX = @prefix
    Given -> delete process.env.N_PREFIX
    afterEach -> console.log.restore()
    Given -> sinon.stub console, 'log'
    Given -> @subject = require('proxyquire').noCallThru() '../lib/n-installed',
      fs: @fs

    describe 'sync', ->
      Then ->
        @subject().should.eql
          node: []
          io: []
          all: []
        console.log.called.should.be.true()

    describe 'async', ->
      When (done) -> @subject( (err, @versions) => done() )
      Then -> @versions.should.eql
        node: []
        io: []
        all: []
