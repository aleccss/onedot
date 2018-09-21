import React, { Component } from 'react';
import { connect} from 'react-redux';
import './App.css';
import { validate } from "./Util";

class DictionariesComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {addMode: false};
  }

  addItem() {
    this.setState({addMode: true});
  }

  addItemDone() {
    var newDictTitle = document.getElementById("newDict").value;
    if(this.props.dictionaries[newDictTitle]) {
      alert("This dictionary title already exists");
      return;
    }
    if(newDictTitle) {
      this.props.addDict(newDictTitle);
    }
    this.setState({addMode: !this.state.addMode});
  }

  checkDict(dict) {
    var result = validate(this.props.dictionaries[dict]);
    var isWarning = false;
    var keys = Object.keys(result);
    keys.forEach((item) => {
      if(result[item].warning){
        isWarning = true;
      };
    });
    if(!isWarning) {
      alert("Dictionary " + dict + " is valid !");
    } else {
      this.props.replaceDict(dict, result);
    }
  }

  render() {
    var dict = Object.keys(this.props.dictionaries);
    var buttonStyle = {marginTop: "20px"};
    var fontStyle = {fontSize: "30px"};
    return (
      <div className="container">
        <div className="row">
          {dict.map( (item) => {
            return ( <div key={Math.random().toString(36).substr(2, 9)} className="col-md-4 card">
                      <div className="card-header">
                        <div className="row">
                          <div className="col-xs-6">
                            <h3>{item}</h3>
                          </div>
                          <div className="col-xs-3" style={buttonStyle}>
                            <button className="btn btn-default"
                                    onClick={() => this.checkDict(item)}>Validate</button>
                          </div>
                          <div className="col-xs-3" style={buttonStyle}>
                            <span className="glyphicon glyphicon-remove"
                                  style={fontStyle} onClick={() => this.props.deleteDict(item)}/>
                          </div>
                        </div>
                      </div>
                      <ul className="list-group list-group-flush">
                        <Entry entries={this.props.dictionaries[item]} dictionary={item}/>
                      </ul>
                     </div>
                    )
          })}
          <div className="col-md-4 card"
             style={{border: "1px solid lightgrey",
                     marginTop: "20px",
                     borderRadius: "4px"}}>
          {!this.state.addMode ?
              <span className="glyphicon glyphicon-plus"
                    style={{fontSize: "100px",
                            marginTop: "65px",
                            marginBottom: "30px"}}
                    onClick={() => this.addItem()}
                    disabled={this.state.addMode}/> :
              <div className="row">
                   <input id="newDict"
                          className="col-md-10"
                          style={{margin: "10px"}}
                          type="text"
                          name="domain"/>
                  <span className="glyphicon glyphicon-ok"
                        style={{fontSize: "26px", marginTop: "6px"}}
                        onClick={() => this.addItemDone()}/>
              </div>}
          </div>
        </div>
      </div>
    );
  }
}

class EntryComponent extends Component {
  constructor(props) {
    super(props);
    this.newEntry = null;
    this.state = {editMode: false};
  }

  editItem(dict, id) {
    if(!this.state.editMode) {
      this.setState({editMode: !this.state.editMode,
                     editDict: dict,
                     editId: id});
    }
  }

  editItemDone() {
    if(this.state.addMode){
      this.addItemDone();
    } else {
      var newEntry = { domain: document.getElementById(this.state.editDict + this.state.editId + "d").value ||
                               this.props.entries[this.state.editId].domain,
                       range: document.getElementById(this.state.editDict + this.state.editId + "r").value ||
                              this.props.entries[this.state.editId].range};
      if(newEntry.domain && newEntry.range){
        this.props.edit(this.state.editDict, newEntry, this.state.editId);
      }
      this.setState({editMode: !this.state.editMode,
                     editDict: null,
                     editId: null});
    }
  }

  addItem() {
    this.setState({editMode: !this.state.editMode,
                   addMode: true});
  }

  addItemDone() {
    var ids = Object.keys(this.props.entries);
    var newId;
    if(ids.length === 0) {
      newId = 0;
    } else {
      newId = parseInt(ids[ids.length - 1], 10) + 1;
    }

    var newEntry = { domain: document.getElementById("newEntryDomain").value,
                     range: document.getElementById("newEntryRange").value};
    if(newEntry.domain === newEntry.range) {
      alert("Can't add same Domain and Range");
      return;
    }
    if(newEntry.domain && newEntry.range) {
      this.props.add(this.props.dictionary, newEntry, newId);
    }
    this.setState({editMode: !this.state.editMode,
                   addMode: !this.state.addMode});
  }

  isDisabled(dict, item) {
    if(this.state.editDict === dict && this.state.editId === item) {
      return false
    } else {
      return true;
    }
  }

  getWarningStyle(input) {
    if(input.warning.type === "duplicate") {
      return {color: "orange"};
    } else {
      return {color: "red"};
    }
  }

  render() {
    var entries = Object.keys(this.props.entries);
    var marginLeft = {marginLeft: "5px"};
    var marginTop = {marginTop: "5px"};
    return(
      <li className="list-group-item">
        <div className="row">
           <div className="col-md-4">
             <h3>Domain</h3>
           </div>
           <div className="col-md-4">
             <h3>Range</h3>
           </div>
           <div className="col-md-4">
             {this.state.editMode ?
               <span className="glyphicon glyphicon-ok"
                     style={{fontSize: "22px", marginTop: "20px"}}
                     onClick={() => this.editItemDone()}/> :
               <button className="btn btn-default"
                       onClick={() => this.addItem()}
                       style={{marginTop: "16px"}}
                       disabled={this.state.editMode}>Add Entry</button>}
           </div>
        </div>
        {entries.map( (item) => {
          var that = this;
          return (
                   <div key={Math.random().toString(36).substr(2, 9)} className="row" style={marginTop}>
                      <input id={this.props.dictionary + item + "d"}
                             className="col-md-4"
                             style={marginLeft}
                             type="text"
                             name="domain"
                             placeholder={this.props.entries[item].domain}
                             disabled={that.isDisabled(this.props.dictionary, item)}/>
                      <input id={this.props.dictionary + item + "r"}
                             className="col-md-4"
                             type="text"
                             name="range"
                             placeholder={this.props.entries[item].range}
                             disabled={that.isDisabled(this.props.dictionary, item)}/>
                      <div className="col-md-1">
                        <span className="glyphicon glyphicon-pencil"
                              onClick={() => that.editItem(this.props.dictionary, item)}
                              disabled={this.state.editMode}/>
                      </div>
                      <div className="col-md-1">
                        <span className="glyphicon glyphicon-remove"
                              onClick={() => this.props.delete(this.props.dictionary, item)}
                              disabled={this.state.editMode}/>
                      </div>
                      {this.props.entries[item].warning ?
                        <div className="col-md-1">
                          <span className="glyphicon glyphicon-exclamation-sign"
                                style={this.getWarningStyle(this.props.entries[item])}
                                title={this.props.entries[item].warning.type}/>
                        </div> : null}
                   </div>
                  )
        })}
        {this.state.addMode ? <div className="row" style={marginTop}>
                                <input id="newEntryDomain"
                                       className="col-md-4"
                                       style={marginLeft}
                                       type="text"
                                       name="domain"/>
                                <input id="newEntryRange"
                                       className="col-md-4"
                                       type="text"
                                       name="range"/>
                              </div>

          : null}
      </li>
    );
  }
}

function mapDictionaryState(state) {
  return {dictionaries: state};
}

function mapEntryState(state, dict) {
  return {entries: dict.entries,
          dictionary: dict.dictionary};
}

function mapDispatchToPropsDict(dispatch) {
  return {
    addDict: (dictName) => dispatch({type: "ADD_DICTIONARY", dictionary: dictName}),
    deleteDict: (dictName) => dispatch({type: "DELETE_DICTIONARY", dictionary: dictName}),
    replaceDict: (dictName, newDict) => dispatch({type: "REPLACE_DICTIONARY", dictionary: dictName, newDictionary: newDict}),
  };
}

function mapDispatchToPropsEntry(dispatch) {
  return {
    add: (dictName, newEntry, id) => dispatch({type: "ADD_ENTRY", dictionary: dictName, newEntry: newEntry, id: id}),
    edit: (dictName, newEntry, id) => dispatch({type: "EDIT_ENTRY", dictionary: dictName, newEntry: newEntry, id: id}),
    delete: (dictName, id) => dispatch({type: "DELETE_ENTRY", dictionary: dictName, id: id})
  };
}

const Dictionary = connect(mapDictionaryState, mapDispatchToPropsDict)(DictionariesComponent);
const Entry = connect(mapEntryState, mapDispatchToPropsEntry)(EntryComponent);


class App extends Component {
  render() {
    return (
      <div className="App">
        <Dictionary/>
      </div>
    );
  }
}

export default App;
