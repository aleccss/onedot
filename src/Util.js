
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function checkDuplicate(input, toCheck) {
  var keys = Object.keys(input);
  var result = [];
  keys.forEach((key) => {
    if(key !== toCheck.id && input[key][toCheck.type] === toCheck.value) {
      result.push(key);
    }
  });

  if(result.length === 0) {
    return {};
  }
  if(result.length === 1) {
    return {type: "duplicate",
            id: result[0]}
  } else {
    return {type: "duplicate",
            ids: result}
  }
}

function checkCycles(input, id) {
  var keys = Object.keys(input);
  var result = [];
  keys.forEach((key) => {
    if(key !== id && input[id].domain === input[key].range) {
      result.push(key);
    }
  });

  if(result.length === 0) {
    return {};
  }
  if(result.length === 1) {
    if(input[id].range === input[result].domain){
      return {type: "cycle",
              ids: [result[0], id]};
    }
  }
}

function checkChain(input, id) {
  var keys = Object.keys(input);
  var result = [];
  keys.forEach((key) => {
    if(key !== id && input[id].range === input[key].domain) {
      result.push(key);
    }
  });

  if(result.length === 0) {
    return {};
  }
  if(result.length === 1) {
    if(input[id].domain === input[result].range){
      return {type: "cycle",
              ids: [result[0],id]};
    } else {
      return {type: "chain",
              ids: [result[0],id]};
    }
  }
}

function emptyWarnings(input) {
  var result = {...input};
  var keys = Object.keys(input);
  keys.forEach((key) => {
    delete result[key].warning;
  });
  return result;
}

function validate(input) {
  var result = {};
  if(isEmpty(input)) {
    return result;
  }
  result = emptyWarnings(input);
  var keys = Object.keys(input);
  keys.forEach((key) => {
    var inputKeys = Object.keys(input[key]);
    inputKeys.forEach((inputKey) => {
      var toCheck = {value: input[key][inputKey],
                     type: inputKey,
                     id: key};
      var duplicate = checkDuplicate(input, toCheck);
      if(!isEmpty(duplicate)) {
        result[key].warning = duplicate;
      }
    });
    var cycle = checkCycles(input, key);
    if(!isEmpty(cycle)) {
      result[cycle.ids[0]].warning = {type: cycle.type, id: cycle.ids[1]};
      result[cycle.ids[1]].warning = {type: cycle.type, id: cycle.ids[0]};
    }
    var chain = checkChain(input, key);
    if(!isEmpty(chain)) {
      result[chain.ids[0]].warning = {type: chain.type, id: chain.ids[1]};
      result[chain.ids[1]].warning = {type: chain.type, id: chain.ids[0]};
    }
  });
  return result;
}

module.exports = {validate: validate};
