const parseContactType = (contactType) => {
  const isString = typeof contactType === 'string';
  if (!isString) return;
  const isContactType = (contactType) =>
    ['work', 'home', 'personal'].includes(contactType);
  if (isContactType(contactType)) return contactType;
};

const parseBoolean = (value) => {
  const isString = typeof value === 'string';
  if (!isString) return;

  const trimmedValue = value.trim().toLowerCase();
  if (trimmedValue === 'true') {
    return true;
  } else if (trimmedValue === 'false') {
    return false;
  }

  return;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;
  const parsedContactType = parseContactType(type);
  const parsedFavourite = parseBoolean(isFavourite);

  return {
    type: parsedContactType,
    isFavourite: parsedFavourite,
  };
};
