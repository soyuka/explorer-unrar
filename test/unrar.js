var Job = require('../job.js')
var Stat = require('./stat.js')
var p = require('path')
var expect = require('chai').expect

var s = new Stat('unrar')
var job = new Job(null, s)

describe('unrar', function() {
  it('should unrar tree', function(cb) {
    this.timeout(10000)
    job.create({username: 'test'}, p.join(__dirname), cb)
  })

  it('should get notification', function(cb) {
     expect(job.info()).to.have.property('test')
     expect(job.info().test).to.have.length.of(2)
     cb()
  })
})
