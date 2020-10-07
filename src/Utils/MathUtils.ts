import Vec2 from "../DataTypes/Vec2";

export default class MathUtils {
    /**
     * Returns the sign of the value provided
     * @param x The value to extract the sign from
     */
    static sign(x: number): number {
        return x < 0 ? -1 : 1;
    }

    /**
     * Clamps the value x to the range [min, max], rounding up or down if needed
     * @param x The value to be clamped
     * @param min The min of the range
     * @param max The max of the range
     */
    static clamp(x: number, min: number, max: number): number {
        if(x < min) return min;
        if(x > max) return max;
        return x;
    }

    /**
     * Clamps the value x to the range between 0 and 1
     * @param x The value to be clamped
     */
    static clamp01(x: number): number {
        return MathUtils.clamp(x, 0, 1);
    }

    static clampMagnitude(v: Vec2, m: number): Vec2 {
        if(v.magSq() > m*m){
            return v.scaleTo(m);
        } else{
            return v;
        }
    }

    /**
	 * Linear Interpolation
	 * @param a The first value for the interpolation bound
	 * @param b The second value for the interpolation bound
	 * @param x The value we are interpolating
	 */
	static lerp(a: number, b: number, x: number){
		return a + x * (b - a);
	}

    /**
     * Returns the number as a hexadecimal
     * @param num The number to convert to hex
     * @param minLength The length of the returned hex string (adds zero padding if needed)
     */
    static toHex(num: number, minLength: number = null): string {
        let factor = 1;
        while(factor*16 < num){
            factor *= 16;
        }
        let hexStr = "";
        while(num > 0){
            let digit = Math.floor(num/factor);
            hexStr += MathUtils.toHexDigit(digit);
            num -= digit * factor;
            factor /= 16;
		}
		
		if(minLength !== null){
			while(hexStr.length < minLength){
				hexStr = "0" + hexStr;
			}
		}

        return hexStr;
    }

    /**
     * Converts the number to hexadecimal
     * @param num The number to convert to hexadecimal
     */
    static toHexDigit(num: number): string {
        if(num < 10){
            return "" + num;
        } else {
            return String.fromCharCode(65 + num - 10);
        }
    }
}