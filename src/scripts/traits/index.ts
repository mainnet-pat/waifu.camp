import beliefs from './beliefs';
import facets  from './facets';
import body    from './body';
import soul    from './soul';

// @ts-ignore
import * as crypto from "webcrypto";
import BigNumber from "bignumber.js";

const successive_generator = function* (tokenid: string): any {
    let b = tokenid;

    while (true) {
        yield new BigNumber('0x'+b);
        b = crypto.createHash('sha256').update(b).digest().toString('hex');
    }
};

const extract_remainder = (big: BigNumber, modulus: number): number => {
    return big.modulo(modulus).toNumber();
}

const get_phrase_id_from_v = (v: number, mid: number): number => {
    if (mid === 3) {
        return v === 0 ? 0
             : v <   6 ? 1
             : v <  29 ? 2
             : v < 222 ? 3
             : v < 250 ? 4
             : v < 255 ? 5
             :           6;
    }

    if (mid === 4) {
        return v === 0 ? 0
             : v <   3 ? 1
             : v <   8 ? 2
             : v <  29 ? 3
             : v < 222 ? 4
             : v < 247 ? 5
             : v < 252 ? 6
             : v < 255 ? 7
             :           8;
    }

    return -1;
};

const generate_npc = (tokenid: string): any => {
    const it = successive_generator(tokenid);

    let ret: any = {};

    ret['beliefs'] = {};
    for (let k of Object.keys(beliefs)) {
        const v = extract_remainder(it.next().value, 256);
        ret['beliefs'][k] = v;
    }

    ret['facets'] = {};
    for (let k of Object.keys(facets)) {
        const v = extract_remainder(it.next().value, 256);
        ret['facets'][k] = v;
    }

    ret['body'] = {};
    for (let k of Object.keys(body)) {
        const v = extract_remainder(it.next().value, 256);
        ret['body'][k] = v;
    }

    ret['soul'] = {};
    for (let k of Object.keys(soul)) {
        const v = extract_remainder(it.next().value, 256);
        ret['soul'][k] = v;
    }

    return ret;
};

const extract_phrases = (npc_phrase_obj: any, phrases: any, mid: number) => {
    let ret: string[] = [];

    for (let k of Object.keys(npc_phrase_obj)) {
        const phrase_id: number = get_phrase_id_from_v(npc_phrase_obj[k], mid);
        if (phrase_id != mid) {
            ret.push(phrases[k][phrase_id]);
        }
    }

    return ret;
};

export function traits(tokenId: string) {
    const npc = generate_npc(tokenId);

    let data: any = {};
    data.beliefs = extract_phrases(npc.beliefs, beliefs, 3);
    data.facets  = extract_phrases(npc.facets,  facets,  3);
    data.body    = extract_phrases(npc.body,    body,    4);
    data.soul    = extract_phrases(npc.soul,    soul,    4);

    return data;
};
