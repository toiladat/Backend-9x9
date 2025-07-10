

export const OBJECT_ID_RULE = /^[0-9a-fA-F]{24}$/
export const OBJECT_ID_RULE_MESSAGE = 'Your string fails to match the Object Id pattern!'

export const ADRESS_RULE = /^0x[a-fA-F0-9]{40}$/
export const BIRTH_RULE = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/

export const UUID_V4_RULE = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
export const UUID_V4_MESSAGE = '{{#label}} phải là UUID phiên bản 4 hợp lệ'