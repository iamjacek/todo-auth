export const setListsToStorage = (data, value = "lists") => {
  if (localStorage) {
    localStorage.setItem(value, JSON.stringify(data))
  }
}

export const getListsFromStorage = (value = "lists") => {
  if (localStorage && localStorage.getItem(value)) {
    return JSON.parse(localStorage.getItem(value))
  }
  return []
}

export const clearListsInStorage = (value = "lists") => {
  if (localStorage) {
    localStorage.removeItem(value)
  }
}
