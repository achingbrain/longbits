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
})
