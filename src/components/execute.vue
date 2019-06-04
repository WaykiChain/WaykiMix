<template>
  <div class="page">
    <div class="deploy" v-show="tabIndex===0">
      <div class="environment">
        <div class="title">
          <span>Environment</span>
          <div class="save" @click="login('1')">
              <span>Refresh</span>
            </div>
        </div>
        <ul>
          <li class="network">
            <label style="padding-right: 20px;">
              NetWork ：{{account.network}}
              <!--<select v-model="network">-->
              <!--<option :value="account.network">{{account.network}}</option>-->
              <!--<option value="location">{{'location'| filts }}</option>-->
              <!--</select>-->
            </label>
            <label v-if="network==='location'">
              Port ：
              <input type="tel" v-model="port">
            </label>
          </li>
          <li class="input" v-if="network==='location'">
            <label>
              RpcUsername ：
              <input type="text" v-model="user">
            </label>
            <label style="margin-left: 15px;">
              RpcPassword ：
              <input type="password" v-model="password">
            </label>
          </li>
          <li>
            <p>Account：</p>
            <p id="address">
              <span>{{account.address}}</span>
              <img
                style="cursor: pointer"
                data-clipboard-target="#address"
                @click="copy('.copyAddress')"
                class="copyAddress"
                src="../assets/copy.svg"
              >
            </p>
          </li>
          <li>
            <p>Balance：</p>
            <p id="address">{{balance ? balance : 0}}</p>
            <p class="wicc">WICC</p>
          </li>
        </ul>
        <p style="margin: 12px auto;color:#7F8CA3">
          <span style>Note：Can change Network and Account in</span>
          <span style="color:#008DFF">WaykiMax</span>
        </p>
      </div>
      <p
        class="deployButton"
        :class="{loading:isloading}"
        @click="deployButton"
      >{{isloading ? 'loading..' : 'Deploy'}}</p>
    </div>
    <div class="run" v-show="tabIndex===1">
      <div class="contract">
        <div class="txHash">
          <p>Deployed contract Txhash:</p>
          <textarea v-model="txHash" id="txHash"></textarea>
          <span class="TxHashCopy" data-clipboard-target="#txHash" @click="copy('.TxHashCopy')">
            <img style="cursor: pointer" src="../assets/copy.svg">
          </span>
        </div>
        <div class="content">
          <div class="title">
            <span>Contract Regid:</span>
           
            <div class="save" @click="getContract()">
              <span>Get</span>
            </div>
          </div>
          <p class="regid">
            <input
              type="text"
              v-model="contractRegId"
              id="regId"
              autocomplete="off"
            >
            <span data-clipboard-target="#regId" @click="copy('.REGID')" class="REGID">
              <img style="cursor: pointer;" src="../assets/copy.svg">
            </span>
          </p>
        </div>
      </div>
      <div class="parameter">
        <div class="add">
          <div class="transfarm">
            <div>
              <span class="title">Param</span>
            </div>
            <div style="box-sizing: border-box;">
              <select id="select" v-model="type">
                <option v-for="item in options" :key="item.value" :value="item.value">{{item.label}}</option>
              </select>
              <img class="addBottom" @click="addParam" src="../assets/add.svg">
            </div>
          </div>
          <div class="item">
            <div class="cell" v-for="(item, index) in params" :key="index">
              <img class="delParam" @click="setDelete(index)" src="../assets/delete.svg">
              <p class="typeStr">{{item.name}}</p>
              <input
                :type="(item.type == 2 || item.type == 3) ? 'number' : 'text'"
                v-model="item.val"
                @input="setTransfer(item.type, index)"
              >
              <p class="typeStr" style="width:42px;margin-left:30px;">toHex</p>
              <p class="result">{{item.transferVal}}</p>
            </div>
          </div>
          <div class="btnDiv">
              <div class="save" style="background:#343E53;" @click="SaveParam">
                <span>Save</span>
              </div>
              <div class="save" @click="Gen(false)">
                <span>Gen</span>
              </div>
            </div>
        </div>
      </div>
      <div class="CallCommand">
        <div class="command">
          <p>Call Contract:</p>
          <div class="contractStr">
            <span class="t">Param</span>
            <textarea type="text" id="contractValue" v-model="sampleCode"></textarea>
            <span
              data-clipboard-target="#contractValue"
              @click="copy('.contractTagert')"
              class="contractTagert"
            >
              <img style="cursor: pointer;" src="../assets/copy.svg">
            </span>
          </div>
          <div class="contractStr">
            <span class="t">Amount</span>
            <input class="amountInput" v-model="wiccNum" type="number">
            <span>sawi</span>
          </div>
          <div class="btnDiv">
            <div class="save" @click="invokeContract">
              <span>Call</span>
            </div>
          </div>
        </div>
      </div>
      <div class="CollectionsDiv">
        <p class="tabTitle">Collections</p>
        <div class="collectionsView">
          <div class="Collection_cell" v-for="(item,index) in savedParams" :key="index">
            <img src="../assets/delete.svg" @click="deleteSavedParam(index)">
            <label class="paramT">Param{{index+1}}</label>
            <label class="paramV">{{item.param}}</label>
            <div class="location">
              <img src="../assets/edit.svg" @click="editSavedParam(item)">
              <label class="call" @click="callSavedParam(item)">Call</label>
            </div>
          </div>
        </div>
      </div>

      <div class="CallCommand" style="border:none">
        <div class="command">
          <div class="GetContractHeader">
            <p>Getcontractadata</p>
            <select id="select" v-model="returnType">
              <option
                v-for="(item,index) in returnTypes"
                :key="index"
                :value="item"
                :disabled="index==0"
                :selected="index==0"
                :hidden="index==0"
              >{{item}}</option>
            </select>
          </div>

          <div class="contractStr">
            <span class="t">Key</span>
            <input id="contractValue" v-model="GetcontractadataKey">
            <span style="color: #1C9AFF;cursor: pointer;" @click="GetDataOnline">Get</span>
          </div>
          <div class="contractStr">
            <span class="t">Value</span>
            <label id="invokeTxHash">{{GetContractValue}}</label>
            <span
              data-clipboard-target="#invokeTxHash"
              @click="copy('.contractTagert')"
              class="contractTagert"
            >
              <img style="cursor: pointer;" src="../assets/copy.svg">
            </span>
          </div>
        </div>
      </div>
    </div>
    <v-tool v-show="tabIndex===2"></v-tool>
    <!--<div class="debug" v-show="tabIndex===3">-->
    <!--Coming soon...-->
    <!--</div>-->
    <div class="help" v-show="tabIndex===3">
      <div class="helpItem">
        <div class="mailbox">
          <label>Guide：</label>
          <p>
            <a
              target="_blank"
              href="https://www.wiccdev.org/book/en/DeveloperHelper/waykimix.html"
            >https://www.wiccdev.org/book/en/DeveloperHelper/waykimix.html</a>
          </p>
          <label>使用指南：</label>
          <p>
            <a
              target="_blank"
              href="https://www.wiccdev.org/book/zh-hans/DeveloperHelper/waykimix.html"
            >https://www.wiccdev.org/book/zh-hans/DeveloperHelper/waykimix.html</a>
          </p>
        </div>
      </div>
      <div class="helpItem">
        <p class="contact">Contact Us：</p>
        <div class="mailbox">
          <label>Telegram：</label>
          <p>
            <a target="_blank" href="https://">https://t.me/waykichaindeveng</a>
          </p>
          <!-- <label>contact mailbox：</label>
          <p>jiao.zheng@waykichainhk.com</p>-->
        </div>
      </div>
      <div class="helpItem" style="border:none">
        <p class="contact" style="font-style:italic">Version: v 2.0.0</p>
      </div>
    </div>

    <el-dialog :visible.sync="dialogInstallInfo" width="666px" center class="dialog">
      <div class="bg">
        <p class="tttt">Please install the WaykiMax first</p>
        <div class="bbbbb">
          <div class="downloadLink">
            <div>
              <span>
                <img src="../assets/chrome.svg" alt>
              </span>
            </div>
            <div class="linkDiv">
              <p class="name">Chrome</p>
              <p class="link">
                <a
                  href="https://chrome.google.com/webstore/detail/waykimax/odaegfdpkolgbdaeibcebmibmibchbce"
                  target="__blank"
                >https: //chrome.google.com/webstore/detail/waykimax/odaegfdpkolgbdaeibcebmibmibchbce</a>
              </p>
            </div>
          </div>

          <div class="downloadLink">
            <div>
              <span>
                <img src="../assets/firefox.svg" alt>
              </span>
            </div>
            <div class="linkDiv">
              <p class="name">Firefox</p>
              <p class="link">
                <a
                  href="https://addons.mozilla.org/en-US/firefox/addon/waykichain/"
                  target="__blank"
                >https://addons.mozilla.org/en-US/firefox/addon/waykichain/</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import { Base64 } from "js-base64";
import Tool from "./tool";
import Vue from "vue";
Vue.use(Base64);
export default {
  name: "execute",
  components: {
    "v-tool": Tool
  },
  props: {
    code: String,
    tabIndex: Number
  },
  filters: {
    filts: function(arg) {
      return "Local Testnet Node";
    }
  },
  watch: {
    tabIndex(val) {
      return (this.tabIndex = parseInt(val));
      if (this.tabIndex === 1 && this.txHash === "") {
        this.contractRegId = "";
      }
    }
  },
  data() {
    return {
      isloading: false,
      dialogInstallInfo: false,
      GetContractValue: "",
      balance: 0, //余额
      GetcontractadataKey: localStorage.getItem("GetcontractadataKey")
        ? localStorage.getItem("GetcontractadataKey")
        : "",
      returnType: "ReturnDataType",
      returnTypes: ["ReturnDataType", "STRING", "NUMBER", "HEX"],
      ifShowN: false,
      port: localStorage.getItem("port")
        ? localStorage.getItem("port")
        : "6968",
      password: localStorage.getItem("password")
        ? localStorage.getItem("password")
        : "wicc123",
      user: localStorage.getItem("user")
        ? localStorage.getItem("user")
        : "waykichain",
      network: "",
      account: {},
      rotates: 0,
      options: [
        { value: "1", label: "String to hex" },
        { value: "2", label: "Int(4byte) to hex" },
        { value: "3", label: "Int(8byte) to hex" },
        { value: "4", label: "UTF-8 to hex" },
        { value: "5", label: "Hex" }
      ],
      txHash: localStorage.getItem("deployedTxHash")
        ? localStorage.getItem("deployedTxHash")
        : "",
      contractRegId: "",

      sampleCode: localStorage.getItem("sampleCode")
        ? localStorage.getItem("sampleCode")
        : "",
      type: "1",
      params: localStorage.getItem("params")
        ? JSON.parse(localStorage.getItem("params"))
        : [],
      invokeTxHash: "",
      wiccNum: localStorage.getItem("wiccNum")
        ? localStorage.getItem("wiccNum")
        : "",
      ifGetRegId: false,
      savedParams: localStorage.getItem("savedParam")
        ? JSON.parse(localStorage.getItem("savedParam"))
        : []
    };
  },
  mounted() {
    // window.onload = () => {
    //   try {
    //     WiccWallet.getDefaultAccount().then(
    //       data => {
    //         this.network = data.network;
    //         this.account = data;
    //         this.login("0");
    //       },
    //       error => {
    //         this.login("0");
    //       }
    //     );
    //   } catch (error) {
    //     this.$emit("errorLog", "Please install WaykiMax at first. Chrome:https: //chrome.google.com/webstore/detail/waykimax/odaegfdpkolgbdaeibcebmibmibchbce, FirFox:https: //addons.mozilla.org/en-US/firefox/addon/waykichain/");
    //   }
    // };
  },
  methods: {
    addParam() {
      this.params.push({
        type: this.type,
        name: this.getName(this.type),
        val: "",
        transferVal: ""
      });
      localStorage.setItem("params", JSON.stringify(this.params));
    },
    getName(type) {
      let name = "";
      switch (+type) {
        case 1:
          name = "String";
          break;
        case 2:
          name = "Int(4byte)";
          break;
        case 3:
          name = "Int(8byte)";
          break;
        case 4:
          name = "UTF-8";
          break;
        case 5:
          name = "Hex";
      }
      return name;
    },
    setSave(type) {
      localStorage.setItem(type, this[type]);
      this.getValue();
    },
    setTransfer(type, index) {
      switch (+type) {
        case 1:
          this.charToCode(index);
          break;
        case 2:
          this.numberToCode(index, 8);
          break;
        case 3:
          this.numberToCode(index, 16);
          break;
        case 4:
          this.strToutf8(index);
          break;
        case 5:
          this.params[index].transferVal = this.params[index].val;
      }
      this.getValue();
    },
    //char
    charToCode(index) {
      let result = "";
      let charVal = this.params[index].val.slice();
      charVal.split("").map(item => {
        result += item.charCodeAt().toString(16);
      });
      this.params[index].transferVal = result;
    },
    //byte number
    numberToCode(index, length) {
      let patch = "00000000000000000000000000",
        arr = [],
        tempStr = "",
        result = "";
      tempStr = (+this.params[index].val.slice()).toString(16);
      tempStr = tempStr.length % 2 === 0 ? tempStr : "0" + tempStr;

      for (let i = 0; i < tempStr.length; i += 2) {
        arr.push(tempStr.substr(i, 2));
      }
      result = arr.reverse().join("");
      result += patch.substr(0, length - result.length);
      this.params[index].transferVal = result;
    },
    //utf-8
    strToutf8(index) {
      let str = this.params[index].val.slice();
      this.params[index].transferVal = this.getUTFCode(str);
    },
    getUTFCode(str) {
      let back = [];
      for (let i = 0; i < str.length; i++) {
        let code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
          back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
          back.push(192 | (31 & (code >> 6)));
          back.push(128 | (63 & code));
        } else if (
          (0x800 <= code && code <= 0xd7ff) ||
          (0xe000 <= code && code <= 0xffff)
        ) {
          back.push(224 | (15 & (code >> 12)));
          back.push(128 | (63 & (code >> 6)));
          back.push(128 | (63 & code));
        }
      }
      for (let i = 0; i < back.length; i++) {
        back[i] &= 0xff;
        back[i] = back[i].toString(16);
      }
      return back.join("");
    },
    setDelete(index) {
      this.params.splice(index, 1);
      this.getValue();
    },
    getValue() {
      localStorage.setItem("params", JSON.stringify(this.params));
    },
    SaveParam() {
      let param = this.Gen(true);
      let Obj = {
        param: param,
        params: localStorage.getItem("params")
      };
      this.savedParams.push(Obj);
      localStorage.setItem("savedParam", JSON.stringify(this.savedParams));
      this.$emit("errorLog", "Yes", "Record add successfully");
    },
    deleteSavedParam(index) {
      this.savedParams.splice(index, 1);
      localStorage.setItem("savedParam", JSON.stringify(this.savedParams));
    },
    editSavedParam(item) {
      this.params = JSON.parse(item.params);
      localStorage.setItem("params", item.params);
    },
    callSavedParam(item) {
      this.sampleCode = item.param;
      this.invokeContract();
    },
    Gen(isSave) {
      let str = "";
      let start = "";
      for (let item in this.showConfig) {
        if (this.showConfig[item]) {
          start += this[item];
        }
      }
      this.params.map(item => {
        str += item.transferVal;
      });
      if (isSave) {
        return start + str;
      }
      this.sampleCode = start + str;
    },
    GetDataOnline() {
      localStorage.setItem("GetcontractadataKey", this.GetcontractadataKey);
      if (this.contractRegId === "") {
        this.$emit("errorLog", "Please entry smart contract regid");
        return false;
      }
      if (this.returnType == "ReturnDataType") {
        this.$emit("errorLog", "Please select a return type");
        return;
      }
      let url = "";
      if (this.account.network === "mainnet") {
        url = "https://baas.wiccdev.org/v2/api/contract/getcontractdata";
      } else {
        url = "https://baas-test.wiccdev.org/v2/api/contract/getcontractdata";
      }
      let para = {
        key: this.GetcontractadataKey,
        regid: this.contractRegId,
        returndatatype: this.returnType
      };
      this.$http
        .post(url, para)
        .then(res => {
          
          if (res.data.code == 0) {
            this.$emit("errorLog", "Yes", res.data);
            this.GetContractValue = res.data.data.value;
          }else{
            this.$emit("errorLog", res.data);
          }
        })
        .catch(err => {
          this.$emit("errorLog", error);
        });
    },
    invokeContract() {
      localStorage.setItem("wiccNum", this.wiccNum);
      let _this = this;
      if (this.contractRegId === "") {
        this.$emit("errorLog", "Please entry smart contract regid");
        return false;
      }
      if (this.sampleCode === "") {
        this.$emit("errorLog", "Please entry smart contract regid");
        return false;
      }
      try {
        WiccWallet.callContract(
          this.contractRegId,
          this.sampleCode,
          parseInt(this.wiccNum),
          (error, data) => _this.check(error, data, "InvokeContract")
        ).then(
          () => {},
          error => {
            this.$emit("errorLog", error.message);
          }
        );
      } catch (error) {
       
        this.dialogInstallInfo = true;
      }
    },
    //复制hash值
    copy(name) {
      let clipboard = new Clipboard(name);
      this.$emit("errorLog", "Yes", "Copy Success");
      clipboard.on("success", function(e) {
        e.clearSelection();
      });
    },
    //登录
    login(index) {
      let _this = this;
      if (index === "1") {
        _this.rotates = 1;
      }
      _this.$nextTick(() => {
        try {
          WiccWallet.getDefaultAccount().then(
            data => {
              //_this.network = data.network;
              _this.account = data;
              _this.getAcountBalance();
            },
            error => {
              _this.$emit("errorLog", error.message);
              // _this.network = null;
              _this.account = {};
            }
          );
        } catch (error) {
          // _this.$emit(
          //   "errorLog",
          //   "Please install WaykiMax at first. Chrome:https: //chrome.google.com/webstore/detail/waykimax/odaegfdpkolgbdaeibcebmibmibchbce, FirFox:https: //addons.mozilla.org/en-US/firefox/addon/waykichain/"
          // );
          _this.dialogInstallInfo = true;
        }
      });
      setTimeout(function() {
        _this.rotates = 0;
      }, 1100);
    },
    deployButton() {
      let _this = this;
      let url = "https://runcode-api2-ng.dooccn.com/compile2";
      let para = {
        language: 25,
        code: Base64.encode(_this.code),
        stdin: 123
      };
      this.isloading = true;
      _this.$http
        .post(url, para)
        .then(res => {
          _this.isloading = false;
          let errorMsg = res.data.errors;
          if (errorMsg != "") {
            let iii = errorMsg.indexOf("module");
            if (iii == -1) {
              _this.$emit("errorLog", errorMsg);
              return;
            }
            _this.deploy(_this);
            return;
          }
          _this.deploy(_this);
        })
        .catch(err => {
          _this.isloading = false;
        });
    },
    deploy(_this) {
      _this.login("0");
      setTimeout(() => {
        try {
          WiccWallet.publishContract(_this.code, "", (error, data) =>
            _this.check(error, data, "deploy")
          ).then(
            () => {},
            error => {
              _this.$emit("errorLog", error.message);
            }
          );
        } catch (error) {
          // _this.$emit(
          //   "errorLog",
          //   "Please install WaykiMax at first. Chrome:https: //chrome.google.com/webstore/detail/waykimax/odaegfdpkolgbdaeibcebmibmibchbce, FirFox:https: //addons.mozilla.org/en-US/firefox/addon/waykichain/"
          // );
          _this.dialogInstallInfo = true;
        }
      }, 100);
    },
    getContract() {
      let _this = this;
      if (!_this.account.network) {
        debugger
        this.login("0");
      } else {
        if (_this.txHash === "") {
          _this.$emit(
            "errorLog",
            "Please get the contract deployment transaction hash first"
          );
        } else {
          if (_this.account.network === "mainnet") {
            _this.reAPI = "https://baas.wiccdev.org/v1/api/contract/regid";
          } else {
            _this.reAPI = "https://baas-test.wiccdev.org/v1/api/contract/regid";
          }
          _this.$http
            .post(_this.reAPI, { hash: _this.txHash })
            .then(function(response) {
              let data = response.data;
              if (data.code === 0) {
                if (data.data.result) {
                  _this.contractRegId = data.data.result.regid;
                  _this.ifGetRegId = true;
                  _this.$emit(
                    "errorLog",
                    "Yes",
                    "Get contract regid:" + _this.contractRegId + " by deploy contract " + "txhash：" +  _this.txHash
                  );
                } else {
                  _this.ifGetRegId = false;
                  _this.contractRegId = data.data.error.message;
                }
              } else {
                _this.$emit("errorLog", data.message);
              }
            })
            .catch(function(error) {
              _this.$emit("errorLog", error.message);
            });
        }
        setTimeout(function() {
          _this.rotates = 0;
        }, 1100);
      }
    },
    check(error, data, from) {
      if (error === null) {
        if (from === "deploy") {
          this.txHash = data.txid;
          this.$emit("errorLog", "Yes", "Deploy contract txhash: " + this.txHash);
          localStorage.setItem("deployedTxHash", data.txid);
        } else {
          this.invokeTxHash = data.txid;
          this.$emit("errorLog", "Yes", this.account.address + "call contract regid：" + this.contractRegId + ",arguments：" + this.sampleCode + ",amount：" + this.wiccNum + "sawi" + "returnHash：" + this.invokeTxHash);
        }
      } else {
        this.$emit("errorLog", error.message);
        if (from === "deploy") {
          this.txHash = "";
        } else {
          this.invokeTxHash = "";
        }
      }
    },
    getAcountBalance() {
      let url = "";
      if (this.account.network === "mainnet") {
        url = "https://baas.wiccdev.org/v2/api/account/getaccountinfo";
      } else {
        url = "https://baas-test.wiccdev.org/v2/api/account/getaccountinfo";
      }
      let para = {
        address: this.account.address
      };
      this.$http
        .post(url, para)
        .then(res => {
          if (res.data.code == 0) {
            this.balance = parseInt(res.data.data.balance) / 100000000;
          }
        })
        .catch(err => {
          this.$emit("errorLog", error);
        });
    }
  }
};
</script>

<style scoped src="../assets/execute.less" lang="less"></style>
<style lang="less">
.dialog {
  .el-dialog__header {
    padding: 0;
    height: 0 !important;
  }
  .el-dialog__body {
    padding: 0;
  }
  .el-dialog--center .el-dialog__body {
    padding: 0;
  }
}
</style>
