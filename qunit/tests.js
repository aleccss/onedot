
var mockData = {
    "firstDict" : {"0" : { domain: "firstDomain",
                           range: "firstRange"},
                   "1" : { domain: "secondDomain",
                           range: "secondRange"}},
    "secondDict": {"0" : { domain: "firstDomain",
                           range: "firstRange"},
                   "1" : { domain: "firstDomain",
                           range: "secondRange"}},
    "thirdDict": {"0" : { domain: "firstDomain",
                          range: "firstRange"},
                  "1" : { domain: "firstDomain",
                          range: "secondRange"},
                  "2" : { domain: "secondDomain",
                          range: "thirdRange"},
                  "3" : { domain: "firstDomain",
                          range: "fourth"}},
    "fourthDict": {"0" : { domain: "firstDomain",
                           range: "firstRange"},
                   "1" : { domain: "firstDomain",
                           range: "firstRange"}},
    "fifthDict": {"0" : { domain: "firstDomain",
                          range: "range"},
                  "1" : { domain: "secondDomain",
                          range: "range"},
                  "2" : { domain: "thirdDomain",
                          range: "thirdRange"},
                  "3" : { domain: "fourthDomain",
                          range: "range"}},
    "sixthDict": {"0" : { domain: "firstDomain",
                          range: "firstRange"},
                  "1" : { domain: "firstDomain",
                          range: "firstRange"}},
    "seventhDict": {"0" : { domain: "firstDomain",
                            range: "range"},
                    "1" : { domain: "range",
                            range: "firstDomain"}},
    "eighthDict": {"0" : { domain: "firstDomain",
                           range: "range"},
                   "1" : { domain: "domain",
                           range: "firstDomain"}},
    "ninethDict": {"0" : { domain: "firstDomain",
                          range: "firstRange"},
                  "1" : { domain: "fourth",
                          range: "secondRange"},
                  "2" : { domain: "secondDomain",
                          range: "thirdRange"},
                  "3" : { domain: "firstDomain",
                          range: "fourth"}}
};

var mockResult = {
  "firstDict" : {"0" : { domain: "firstDomain",
                         range: "firstRange"},
                 "1" : { domain: "secondDomain",
                         range: "secondRange"}},
  "secondDict": {"0" : { domain: "firstDomain",
                         range: "firstRange",
                         warning: {type: "duplicate",
                                   id: "1"}},
                 "1" : { domain: "firstDomain",
                         range: "secondRange",
                         warning: {type: "duplicate",
                                   id: "0"}}},
  "thirdDict": {"0" : { domain: "firstDomain",
                        range: "firstRange",
                        warning: {type: "duplicate",
                                  ids: ["1","3"]}},
                "1" : { domain: "firstDomain",
                        range: "secondRange",
                        warning: {type: "duplicate",
                                  ids: ["0","3"]}},
                "2" : { domain: "secondDomain",
                        range: "thirdRange"},
                "3" : { domain: "firstDomain",
                        range: "fourth",
                        warning: {type: "duplicate",
                                  ids: ["0","1"]}}},
  "fourthDict": {"0" : { domain: "firstDomain",
                        range: "firstRange",
                        warning: {type: "duplicate",
                                  id: "1"}},
                "1" : { domain: "firstDomain",
                        range: "firstRange",
                        warning: {type: "duplicate",
                                  id: "0"}}},
  "fifthDict": {"0" : { domain: "firstDomain",
                        range: "range",
                        warning: {type: "duplicate",
                                  ids: ["1","3"]}},
                "1" : { domain: "secondDomain",
                        range: "range",
                        warning: {type: "duplicate",
                                  ids: ["0","3"]}},
                "2" : { domain: "thirdDomain",
                        range: "thirdRange"},
                "3" : { domain: "fourthDomain",
                        range: "range",
                        warning: {type: "duplicate",
                                  ids: ["0","1"]}}},
  "sixthDict": {"0" : { domain: "firstDomain",
                        range: "firstRange",
                        warning: {type: "duplicate",
                                  id: "1"}},
                "1" : { domain: "firstDomain",
                        range: "firstRange",
                        warning: {type: "duplicate",
                                  id: "0"}}},
  "seventhDict": {"0" : { domain: "firstDomain",
                          range: "range",
                          warning: {type: "cycle",
                                    id: "1"}},
                  "1" : { domain: "range",
                          range: "firstDomain",
                          warning: {type: "cycle",
                                    id: "0"}}},
  "eighthDict": {"0" : { domain: "firstDomain",
                         range: "range",
                         warning: {type: "chain",
                                   id: "1"}},
                 "1" : { domain: "domain",
                         range: "firstDomain",
                         warning: {type: "chain",
                                   id: "0"}}},
  "ninethDict": {"0" : { domain: "firstDomain",
                         range: "firstRange",
                         warning: {type: "duplicate",
                                   id: "3"}},
                 "1" : { domain: "fourth",
                         range: "secondRange",
                         warning: {type: "chain",
                                   id: "3"}},
                 "2" : { domain: "secondDomain",
                         range: "thirdRange"},
                 "3" : { domain: "firstDomain",
                         range: "fourth",
                         warning: {type: "chain",
                                   id: "1"}}},

};


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


function validate(input) {
  var result = {};
  if(isEmpty(input)) {
    return result;
  }
  result = {...input};
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

QUnit.test("Test suite", function( assert ) {
  assert.deepEqual( validate({}), {}, "Empty check" );
  assert.deepEqual( validate(mockData.firstDict), mockResult.firstDict, "No duplicates" );
  assert.deepEqual( validate(mockData.secondDict), mockResult.secondDict, "Duplicate domain" );
  assert.deepEqual( validate(mockData.thirdDict), mockResult.thirdDict, "Duplicate multiple domains" );
  assert.deepEqual( validate(mockData.fourthDict), mockResult.fourthDict, "Duplicate range" );
  assert.deepEqual( validate(mockData.fifthDict), mockResult.fifthDict, "Duplicate multiple ranges" );
  assert.deepEqual( validate(mockData.sixthDict), mockResult.sixthDict, "Duplicate domain and range" );
  assert.deepEqual( validate(mockData.seventhDict), mockResult.seventhDict, "Cycle test" );
  assert.deepEqual( validate(mockData.eighthDict), mockResult.eighthDict, "Chain test" );
  assert.deepEqual( validate(mockData.ninethDict), mockResult.ninethDict, "Duplicate and Chain test" );
});





function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}
