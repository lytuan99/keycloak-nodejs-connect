const {createHash} = require("crypto");
const NodeCache = require("node-cache");

const resourceCache = new NodeCache({stdTTL: 300, maxKeys: 1000});

const hash = (algorithm, {grant_type, audience, subject_token, permission}) => {
  const algorithmReg = /md5|sha1|sha256|sha512/;
  if (!algorithmReg.test(algorithm)) return null;
  const hashedObject = {
    grant_type,
    audience,
    subject_token,
    permission,
  };
  const hashedString = createHash(algorithm)
    .update(JSON.stringify(hashedObject))
    .digest("hex");
  return hashedString;
};

const cacheSource = (hashedString, value, {ttl}) => {
  resourceCache.set(hashedString, value, ttl);
};

const getSourceValue = (hashedString) => {
  const value = resourceCache.get(hashedString);
  return value;
};

module.exports = {
  hash,
  cacheSource,
  getSourceValue,
};
