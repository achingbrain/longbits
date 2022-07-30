/* eslint-env mocha */

import { expect } from 'aegir/chai'
import { Uint8ArrayList } from 'uint8arraylist'
import { LongBits } from '../src/index.js'

describe('longbits', () => {
  it('should round trip positive bigint', () => {
    const val = 6547656755453442n
    const bits = LongBits.fromBigInt(val)

    expect(bits.toBigInt()).to.equal(val)
  })

  it('should round trip negative bigint', () => {
    const val = -6547656755453442n
    const bits = LongBits.fromBigInt(val)

    expect(bits.toBigInt()).to.equal(val)
  })

  it('should round trip negative bigint as bytes', () => {
    const val = -6547656755453442n
    const bits = LongBits.fromBigInt(val)
    const bytes = new Uint8Array(10)
    bits.toBytes(bytes)

    expect(LongBits.fromBytes(bytes).toBigInt()).to.equal(val)
  })

  it('should round trip small negative bigint as bytes with extra bytes', () => {
    const val = -12345n
    const bits = LongBits.fromBigInt(val)
    const bytes = new Uint8Array(12)
    bits.toBytes(bytes)
    bytes[10] = 5
    bytes[11] = 5

    expect(LongBits.fromBytes(bytes).toBigInt()).to.equal(val)
  })

  it('should interpret unsigned bigint', () => {
    const val = -6547656755453442n
    const bits = LongBits.fromBigInt(val)

    expect(bits.toBigInt(true)).to.equal(18440196416954098174n)
  })

  it('should round trip bytes', () => {
    const val = 6547656755453442n
    const bits = LongBits.fromBigInt(val)
    const bytes = new Uint8Array(8)
    bits.toBytes(bytes)

    expect(LongBits.fromBytes(bytes).toBigInt()).to.equal(val)
  })

  it('should round trip byte list', () => {
    const val = 6547656755453442n
    const bits = LongBits.fromBigInt(val)
    const bytes = new Uint8ArrayList(new Uint8Array(8))
    bits.toBytes(bytes)

    expect(LongBits.fromBytes(bytes).toBigInt()).to.equal(val)
  })

  it('should round trip zigzag encoding', () => {
    const val = 6547656755453442n
    const bits = LongBits.fromBigInt(val).zzEncode()

    expect(bits.zzDecode().toBigInt()).to.equal(val)
  })

  it('should round trip number', () => {
    const val = 65476
    const bits = LongBits.fromNumber(val)

    expect(bits.toBigInt()).to.equal(BigInt(val))
  })

  it('should round trip number as number', () => {
    const val = 65476
    const bits = LongBits.fromNumber(val)

    expect(bits.toNumber()).to.equal(val)
  })

  it('should throw on incomplete byte array', () => {
    const val = 6547656755453442n
    const bits = LongBits.fromBigInt(val)
    const bytes = new Uint8Array(8)
    bits.toBytes(bytes)

    expect(() => LongBits.fromBytes(bytes.slice(0, 2)))
      .to.throw(RangeError)
  })

  function randint (range: number) {
    return Math.floor(Math.random() * range)
  }

  it('fuzz test', () => {
    for (let i = 0, len = 100; i < len; ++i) {
      const expected = randint(0x7FFFFFFF)
      const buf = new Uint8Array(12)
      LongBits.fromNumber(expected).toBytes(buf)

      const data = LongBits.fromBytes(buf).toNumber(true)
      expect(expected).to.equal(data, 'fuzz test: ' + expected.toString())
    }
  })

  it('four-byte numbers', () => {
    const buf = new Uint8Array(4)
    LongBits.fromNumber(183950794).toBytes(buf)

    expect(buf).to.equalBytes(Uint8Array.from([202, 187, 219, 87]))

    expect(LongBits.fromBytes(buf).toNumber(true)).to.equal(183950794)
  })

  it('buffer too short', () => {
    const buffer = new Uint8Array(6)
    LongBits.fromNumber(9812938912312).toBytes(buffer)

    let l = buffer.length
    while (l-- > 0) {
      const index = l
      expect(() => {
        LongBits.fromBytes(buffer.slice(0, index))
      }).to.throw(RangeError)
    }
  })
})
