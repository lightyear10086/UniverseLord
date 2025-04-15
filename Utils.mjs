import crypto from 'crypto';

const Utils={
    getObjectHash(obj){
        const str=JSON.stringify(obj);
        const hash=crypto.createHash('sha256').update(str).digest('hex');
        return hash;
    }
}
export default Utils;