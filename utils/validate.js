const required = {
  validate: (v) => {
    return !!v;
  },
  message: (n) => {
    return `${n}不能为空`;
  },
};

const mobile = {
  validate: (v) => {
    return v.length === 11 && /0?(13|14|15|17|18|19)[0-9]{9}/.test(v);
  },
  message: (n) => {
    return "请输入正确的手机号码";
  },
};

const equal = {
  validate: (v, params) => {
    return v === params;
  },
  message: (n) => {
    return "两次密码输入不一致";
  },
};

const url = {
  validate: (v) => {
    return /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/.test(v);
  },
  message: (n) => {
    return '当前不是一个有效的店铺网址';
  },
};

const minValue = {
  validate: (v) => {
    return +v > 0;
  },
  message: (n) => {
    return `${n}数不能为0，请填写真实面积`;
  },
};

const allRules = {
  required,
  mobile,
  equal,
  url,
  minValue,
};

export const validation = (rules = [], v, name, params) => {
  const errors = [];
  for (let i = 0; i < rules.length; i += 1) {
    const element = rules[i];
    if (!allRules[element].validate(v, params)) {
      errors.push(allRules[element].message(name));
    }
  }
  return errors;
};
