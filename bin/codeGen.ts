interface Type {
    name: string;
    type: string; // address, bool, bool[], bytes..., uint..., tuple 
    components?: Type[];
    internalType?: string;
}
interface Item {
    name: string;
    type: string; // event, constructor, function
    stateMutability: string;
    inputs?: Type[];
    outputs?: Type[];
}
interface Line {
    indent: number;
    text: string;
}
export default function(name: string, abiPath: string, abi: Item[], hasBytecode: boolean){
    if (abi.length) {
    let result = [];
    let events = {};
    let txFunctions = [];
    const addLine = function(indent: number, code: string): void {
        if (indent)
            result.push(`    `.repeat(indent) + code)
        else
            result.push(code);
    }

    const inputDataType = function(item: Type): string {
        let type = item.type;
        if (type == 'address' || type == 'string')
            return 'string';
        else if (/^(address|string)(\[\d*\])+$/.test(type))
            return type.replace("address","string").replace(/\d*/g,"");
        else if (type == 'bool')
            return 'boolean';
        else if (/^bool(\[\d*\])+$/.test(type))
            return type.replace("bool","boolean").replace(/\d*/g,"");
        else if (/^bytes\d*(\[\d*\])+$/.test(type))
            return type.replace(/bytes\d*/,"string").replace(/\d*/g,"");
        else if (/^bytes\d*$/.test(type))
            return 'string';
        else if (/^u?int\d*(\[\d*\])+$/.test(type))
            return type.replace(/^u?int\d*/,"(number|BigNumber)").replace(/\d*/g,"");
        else if (/^u?int\d*$/.test(type))
            return 'number|BigNumber';
        else if (type == 'tuple')
            return '{' + item.components.map((e,i)=>`${paramName(e.name,i)}:${inputDataType(e)}`).join(',') + '}';
        else if (/^tuple(\[\d*\])+$/.test(type))
            return '{' + item.components.map((e,i)=>`${paramName(e.name,i)}:${inputDataType(e)}`).join(',') + '}' + type.replace("tuple","").replace(/\d*/g,"");
        else
            return 'any';
    }
    const paramName = function(name: string, idx: number): string {
        if (name)
            return name.replace(/_/g,'');
        else
            return 'param' + (idx + 1);
    }
    const outputDataType = function(item: Type): string {
        let type = item.type;
        if (type == 'address' || type == 'string')
            return 'string';
        else if (/^(address|string)(\[\d*\])+$/.test(type))
            return type.replace("address","string").replace(/\d*/g,"");
        else if (type == 'bool')
            return 'boolean';
        else if (/^bool(\[\d*\])+$/.test(type))
            return type.replace("bool","boolean").replace(/\d*/g,"");
        else if (/^bytes\d*(\[\d*\])+$/.test(type))
            return type.replace(/bytes\d*/,"string").replace(/\d*/g,"");
        else if (/^bytes\d*$/.test(type))
            return 'string';
        else if (/^u?int\d*(\[\d*\])+$/.test(type))
            return type.replace(/^u?int\d*/,"BigNumber").replace(/\d*/g,"");
        else if (/^u?int\d*$/.test(type))
            return 'BigNumber';
        else if (type == 'tuple')
            return '{' + item.components.map((e,i)=>`${paramName(e.name,i)}:${outputDataType(e)}`).join(',') + '}';
        else if (/^tuple(\[\d*\])+$/.test(type))
            return '{' + item.components.map((e,i)=>`${paramName(e.name,i)}:${outputDataType(e)}`).join(',') + '}' + type.replace("tuple","").replace(/\d*/g,"");
        else
            return 'any';
    }
    const outputs = function(items: Type[], isEvent?: boolean): string {
        if (items.length > 1 || isEvent){
            let result = '{';
            for (let i = 0; i < items.length; i ++){
                if (i > 0)
                    result +=',';
                result += ((items[i].name ||`param${i+1}`)) + ':' + outputDataType(items[i]);
            }
            if (isEvent) {
                if (items.length > 0)
                    result +=',';
                result += "_event:Event";
            }
            result += '}'
            return result;
        }
        else if (items.length == 1){
            return outputDataType(items[0]);
        }
        else if (items.length == 0){
            return "void";
        }
        else
            return isEvent ? '{}' : 'any';
    }
    const inputs = function(item: Item): string {
        if (item.inputs.length == 0)
            return '';
        else if (item.inputs.length == 1){
            return `${paramName(item.inputs[0].name,0)}:${inputDataType(item.inputs[0])}`;
        }
        else{
            let result = 'params:{';
            if (item.inputs){
                for (let i = 0; i < item.inputs.length; i ++){
                    if (i > 0)
                        result += ',';
                    result += `${paramName(item.inputs[i].name,i)}:${inputDataType(item.inputs[i])}`;
                }
            }
            return result+'}';
        }
    }
    const toSolidityType = function(prefix: string, inputs: Type[]): string {
        let result = "";
        for (let i = 0 ; i < inputs.length ; i++) {
            if (i > 0)
                result += ',';
            if (/^u?int\d*(\[\d*\])*$/.test(inputs[i].type))
                result += `this.utils.toString(${prefix}${paramName(inputs[i].name,i)})`;
            else if (inputs[i].type == 'tuple')
                result += expendTuple(`${prefix}${paramName(inputs[i].name,i)}.`, inputs[i]);
            else if (/^tuple(\[\d*\])+$/.test(inputs[i].type))
                result += `${prefix}${paramName(inputs[i].name,i)}` +
                          inputs[i].type.match(/(\[\d*\])/g).map((e,i,a)=>i==a.length-1 ? `.map(e=>(` : `.map(a${i}=>a${i}`).join("") +
                          `${expendTuple("e.", inputs[i])}`+
                          inputs[i].type.match(/(\[\d*\])/g).map((e,i)=>i==0?"))":")").join("");
            else if (/^bytes32(\[\d*\])*$/.test(inputs[i].type))
                result += `this.utils.stringToBytes32(${prefix}${paramName(inputs[i].name,i)})`;
            else if (/^bytes(\[\d*\])*$/.test(inputs[i].type))
                result += `this.utils.stringToBytes(${prefix}${paramName(inputs[i].name,i)})`;
            else
                result += `${prefix}${paramName(inputs[i].name,i)}`;
        }
        return result;
    }
    const expendTuple = function(parent: string, tuple: Type): string {
        let result = '[' + toSolidityType(parent, tuple.components) + ']';
        return result;
    }
    const toSolidityInput = function(item: Item): string {
        let prefix = item.inputs.length > 1 ? "params." : "";
        let result = toSolidityType(prefix, item.inputs);
        return result;
    }
    const payable = function(item: Item): string {
        if (item.stateMutability=='payable') {
            return (item.inputs.length == 0 ? '':',') + '_value:number|BigNumber';
        } else {
            return '';
        }
    }
    const returnOutputsItem = function(item: Type, isEvent: boolean, objPath: string, indent: number): Line[] {
        let newLines;
        if (item.type == 'tuple') {
            newLines = [{indent:indent, text:""}, // reserved for "[name]:" or "{name:"
                       ...returnOutputs(item.components, false, isEvent, objPath, indent),
                       {indent:indent, text: ""}]; // reserved for "}"
        }
        else if (/^tuple(\[\d*\])+$/.test(item.type)){
            newLines = [{indent:indent, text:objPath+ item.type.match(/(\[\d*\])/g).map((e,i,a)=>i==a.length-1 ? `.map(e=>(` :`.map(a${i}=>a${i}`).join("")},
                        ...returnOutputs(item.components, false, isEvent, "e", indent+1),
                       {indent:indent, text:item.type.match(/(\[\d*\])/g).map((e,i)=>i==0?"))":")").join("")}];
        }
        else{
            let line;
            if (outputDataType(item) == 'BigNumber')
                line = `new BigNumber(${objPath})`;
            else if (/^BigNumber(\[\d*\])+$/.test(outputDataType(item)))
                line = `${objPath}`+ item.type.match(/(\[\d*\])/g).map((e,i,a)=>i==a.length-1 ? `.map(e=>` :`.map(a${i}=>a${i}`).join("") + `new BigNumber(e)` + item.type.match(/(\[\d*\])/g).map((e,i)=>")").join("");
            else
                line = `${objPath}`;
            newLines = [{indent:indent, text:line}];
        }
        return newLines;
    }
    const returnOutputs = function(items: Type[], addReturn: boolean, isEvent?: boolean, parent?: string, indent?: number): Line[] {
        parent = parent || "result";
        indent = indent || 0;
        let lines = []
        if (items.length > 1 || (isEvent)){
            lines.push({indent:indent, text:addReturn?"return {":"{"});
            indent = indent + 1;
            for (let i = 0; i < items.length; i ++){
                let item = items[i];
                let objPath = parent + (item.name ? `.${item.name}` : `[${i}]`);
                let newLines = returnOutputsItem(items[i], isEvent, objPath, indent);
                newLines[0].text = (item.name || `param${i + 1}`) + ": " + newLines[0].text;
                if ((addReturn && isEvent) || i < items.length -1)
                    newLines[newLines.length-1].text+=','
                lines = [...lines, ...newLines];
            }
            if (addReturn && isEvent)
                lines.push({indent:indent, text:"_event: event"});
            lines.push({indent:indent-1, text:addReturn?"};":"}"});
        }
        else if (items.length == 1){
            let item = items[0];
            let objPath = parent + (indent ? (((!isEvent) && item.name) ? `.${item.name}` : `[0]`) : "");
            let newLines = returnOutputsItem(items[0], isEvent, objPath, indent);
            if (addReturn){
                newLines[0].text = "return " + (newLines.length>1?"(":"") + newLines[0].text;
                newLines[newLines.length-1].text = newLines[newLines.length-1].text + (newLines.length>1?")":"") + ";"
            } else {
                newLines[0].text =  "{" + (item.name ? `${item.name}` : `param1`) + ": " + newLines[0].text;
                newLines[newLines.length-1].text = newLines[newLines.length-1].text + "}"
            }
            lines = newLines;
        }
        else if (items.length == 0){
            lines.push({indent:indent, text:(addReturn?"return;":"")});
        }
        else
            lines.push({indent:indent, text:(addReturn?"return ":"")+'{}'+(addReturn?";":"")});
        return lines;
    }

    let functionNames = {};
    const callFunction = function(name: string, item: Item): void {
        let input = (item.inputs.length > 0) ? `,[${toSolidityInput(item)}]` : "";
        let _payable = item.stateMutability=='payable'?((item.inputs.length==0?", []":"")+', {value:_value}'):'';
        addLine(1, `async ${name}(${inputs(item)}${payable(item)}): Promise<${outputs(item.outputs)}>{
        let result = await this.call('${item.name}'${input}${_payable});`)
        returnOutputs(item.outputs, true).forEach((e,i,a)=>addLine(e.indent+2, e.text));
        addLine(1, '}');
    }
    const sendFunction = function(name: string, item: Item): void { 
        let input = (item.inputs.length > 0) ? `,[${toSolidityInput(item)}]` : "";
        let _payable = item.stateMutability=='payable'?((item.inputs.length==0?", []":"")+', {value:_value}'):'';
        addLine(1, `async ${name}(${inputs(item)}${payable(item)}): Promise<TransactionReceipt>{
        let result = await this.send('${item.name}'${input}${_payable});`);
        addLine(2, 'return result;')
        addLine(1, '}');
    }
    const txObjFunction = function(name: string, item: Item): void { 
        let input = (item.inputs.length > 0) ? `,[${toSolidityInput(item)}]` : "";
        let _payable = item.stateMutability=='payable'?((item.inputs.length==0?", []":"")+', {value:_value}'):'';
        addLine(1, `async ${name}(${inputs(item)}${payable(item)}): Promise<Transaction>{
        let result = await this.txObj('${item.name}'${input}${_payable});`);
        addLine(2, 'return result;')
        addLine(1, '}');
    }
    const addFunction = function(item: Item): void {
        let name = item.name;
        let counter = 1;
        while(functionNames[name]){
            name = name + "_" + counter;
            counter++;
        }
        functionNames[name] = true;
        let constantFunction = (item.stateMutability == 'view' || item.stateMutability == 'pure')
        if (constantFunction){
            callFunction(name, item);
        } else {
            sendFunction(name+"_send", item);
            callFunction(name+"_call", item);
            // txObjFunction(name+"_txObj", item);
            addLine(1, `${name}: {`);
            addLine(2, `(${inputs(item)}${payable(item)}): Promise<TransactionReceipt>;`);
            addLine(2, `call: (${inputs(item)}${payable(item)}) => Promise<${outputs(item.outputs)}>;`);
            // addLine(2, `txObj: (${inputs(item)}) => Promise<Transaction>;`);
            addLine(1, `}`);
            txFunctions.push(name);
        }
    }
    const addEvent = function(item: Item): void {
        let eventItems = item.inputs;
        events[item.name] = outputs(eventItems, true);
        addLine(1, `parse${item.name}Event(receipt: TransactionReceipt): ${name}.${item.name}Event[]{`);
        addLine(2, `return this.parseEvents(receipt, "${item.name}").map(e=>this.decode${item.name}Event(e));`);
        addLine(1, '}');
        addLine(1, `decode${item.name}Event(event: Event): ${name}.${item.name}Event{`);
        // addLine(2, `let events = this.decodeEvent(log, "${item.name}");`);
        // addLine(2, `return events.map(event => {`);
        addLine(2, `let result = event.data;`);
        returnOutputs(eventItems, true, true).forEach((e,i,a)=>addLine(e.indent+2, e.text));
        // addLine(2, '});');
        addLine(1, '}');
    }
    const addDeployer = function(abi: Item[]): void {
        let item = abi.find(e=>e.type=='constructor');
        if (item) {
            let input = (item.inputs.length > 0) ? `[${toSolidityInput(item)}]` : "";
            let _payable = item.stateMutability=='payable'?((item.inputs.length==0?", []":"")+', {value:_value}'):'';
            addLine(1, `deploy(${inputs(item)}${payable(item)}): Promise<string>{`);
            addLine(2, `return this.__deploy(${input}${_payable});`);
            addLine(1, `}`);
        } else {
            addLine(1, `deploy(): Promise<string>{`);
            addLine(2, `return this.__deploy();`);
            addLine(1, `}`);
        }
    }
    const addAbiItem = function(item: Item): void {
        switch (item.type){
            case "function":
                addFunction(item);
                break;
            case "event":
                addEvent(item);
                break;
        }
    }
    addLine(0, `import {IWallet, Transaction, TransactionReceipt, Event, BigNumber, Contract, Utils} from "@ijstech/eth-contract";`);
    addLine(0, `import Bin from "${abiPath}${name}.json";`);
    addLine(0, ``);
    addLine(0, `export class ${name} extends Contract{`);
    addLine(1, `constructor(wallet: IWallet, address?: string){`);
    addLine(2, hasBytecode ? `super(wallet, address, Bin.abi, Bin.bytecode);` : `super(wallet, address, Bin.abi);`);
    addLine(2, `this.assign()`);
    addLine(1, `}`);
    if (hasBytecode)
        addDeployer(abi);
    for (let i = 0; i < abi.length; i++) {
        addAbiItem(abi[i]);
    }
    addLine(1, `private assign(){`);
    for (let i = 0 ; i < txFunctions.length ; i++) {
        addLine(2, `this.${txFunctions[i]} = Object.assign(this.${txFunctions[i]}_send, {call:this.${txFunctions[i]}_call});`);
    }
    addLine(1, `}`);
    addLine(0, `}`);
    if (Object.keys(events).length) {
        addLine(0, `export module ${name}{`);
        for (let e in events)
            addLine(1, `export interface ${e}Event ${events[e]}`);
        addLine(0, `}`);
    }
    return result.join('\n');
    }
}
