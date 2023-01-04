export const BETADIST: (x: any, alpha: any, beta: any, cumulative: any, a: any, b: any, ...args: any[]) => any;
export const BETAINV: (probability: any, alpha: any, beta: any, a: any, b: any) => any;
export const BINOMDIST: {
    (number_s: any, trials: any, probability_s: any, cumulative: any): any;
    RANGE(trials: any, probability_s: any, number_s: any, number_s2: any): number | Error;
};
export const CEILINGMATH: typeof mathTrig.CEILING;
export const CEILINGPRECISE: typeof mathTrig.CEILING;
export const CHIDIST: {
    (x: any, deg_freedom: any, cumulative: any): any;
    RT(x: any, deg_freedom: any): number | Error;
};
export const CHIDISTRT: (x: any, deg_freedom: any) => number | Error;
export const CHIINV: {
    (probability: any, deg_freedom: any): any;
    RT(probability: any, deg_freedom: any): any;
};
export const CHIINVRT: (probability: any, deg_freedom: any) => any;
export const CHITEST: (actual_range: any, expected_range: any, ...args: any[]) => number | Error;
export const COVAR: (array1: any, array2: any) => number | Error;
export const COVARIANCEP: (array1: any, array2: any) => number | Error;
export const COVARIANCES: (array1: any, array2: any) => any;
export const CRITBINOM: (trials: any, probability_s: any, alpha: any) => number | Error;
export const ERFCPRECISE: () => never;
export const ERFPRECISE: () => never;
export const EXPONDIST: (x: any, lambda: any, cumulative: any) => any;
export const FDIST: {
    (x: any, deg_freedom1: any, deg_freedom2: any, cumulative: any): any;
    RT(x: any, deg_freedom1: any, deg_freedom2: any, ...args: any[]): number | Error;
};
export const FDISTRT: (x: any, deg_freedom1: any, deg_freedom2: any, ...args: any[]) => number | Error;
export const FINV: {
    (probability: any, deg_freedom1: any, deg_freedom2: any): any;
    RT(probability: any, deg_freedom1: any, deg_freedom2: any, ...args: any[]): any;
};
export const FINVRT: (probability: any, deg_freedom1: any, deg_freedom2: any, ...args: any[]) => any;
export const FLOORMATH: (number: any, significance: any, mode: any) => any;
export const FLOORPRECISE: (number: any, significance: any, mode: any) => any;
export const FTEST: (array1: any, array2: any) => number | Error;
export const GAMMADIST: (value: any, alpha: any, beta: any, cumulative: any, ...args: any[]) => any;
export const GAMMAINV: (probability: any, alpha: any, beta: any, ...args: any[]) => any;
export const GAMMALNPRECISE: (x: any, ...args: any[]) => any;
export const HYPGEOMDIST: (sample_s: any, number_sample: any, population_s: any, number_pop: any, cumulative: any) => number | Error;
export const LOGINV: (probability: any, mean: any, standard_dev: any) => any;
export const LOGNORMDIST: (x: any, mean: any, standard_dev: any, cumulative: any) => any;
export const LOGNORMINV: (probability: any, mean: any, standard_dev: any) => any;
export const MODEMULT: (...args: any[]) => any[] | Error;
export const MODESNGL: (...args: any[]) => any;
export const NEGBINOMDIST: (number_f: any, number_s: any, probability_s: any, cumulative: any) => any;
export const NETWORKDAYSINTL: (start_date: any, end_date: any, weekend: any, holidays: any) => number | Error;
export const NORMDIST: (x: any, mean: any, standard_dev: any, cumulative: any) => any;
export const NORMINV: (probability: any, mean: any, standard_dev: any) => any;
export const NORMSDIST: (z: any, cumulative: any) => any;
export const NORMSINV: (probability: any) => any;
export const PERCENTILEEXC: (array: any, k: any) => number | Error;
export const PERCENTILEINC: (array: any, k: any) => number | Error;
export const PERCENTRANKEXC: (array: any, x: any, significance: any) => number | Error;
export const PERCENTRANKINC: (array: any, x: any, significance: any) => number | Error;
export const POISSONDIST: (x: any, mean: any, cumulative: any) => any;
export const QUARTILEEXC: (range: any, quart: any) => number | Error;
export const QUARTILEINC: (range: any, quart: any) => number | Error;
export const RANKAVG: (number: any, ref: any, order: any) => any;
export const RANKEQ: (number: any, ref: any, order: any) => any;
export const SKEWP: (...args: any[]) => number | Error;
export const STDEVP: (...args: any[]) => number;
export const STDEVS: (...args: any[]) => number;
export const TDIST: {
    (x: any, deg_freedom: any, cumulative: any): number | Error;
    '2T'(x: any, deg_freedom: any, ...args: any[]): number | Error;
    RT(x: any, deg_freedom: any, ...args: any[]): number | Error;
};
export const TDISTRT: (x: any, deg_freedom: any, ...args: any[]) => number | Error;
export const TINV: {
    (probability: any, deg_freedom: any): any;
    '2T'(probability: any, deg_freedom: any): number | Error;
};
export const TTEST: (array1: any, array2: any) => number | Error;
export const VARP: (...args: any[]) => number | Error;
export const VARS: (...args: any[]) => number;
export const WEIBULLDIST: (x: any, alpha: any, beta: any, cumulative: any) => number | Error;
export const WORKDAYINTL: (start_date: any, days: any, weekend: any, holidays: any) => any;
export const ZTEST: (array: any, x: any, sigma: any) => number | Error;
import * as mathTrig from "./math-trig.js";
