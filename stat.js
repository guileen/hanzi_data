var fs = require('fs')

var dutizi = fs.readFileSync('dutizi.txt', 'utf8')
var chailines = fs.readFileSync('chaizi/chaizi-jt.txt', 'utf-8').split('\n')
var tophz = fs.readFileSync('tophz.txt', 'utf8').split('\n')

// dutizi
const dtz = {}
for(var i = 0; i < dutizi.length; i++) {
    dtz[dutizi[i]] = 1
}
function isDtz(ch) {
    return dtz[ch]
}
// chaizi
const chaizi = {}
for(let line of chailines) {
    const parts = line.split('\t')
    if(parts.length < 2) continue
    chaizi[parts[0]] = parts[1].split(' ')
}
// top hanzi
const partCount = {}
function addCount(z, c) {
    if(!partCount[z]) {
        partCount[z] = c
    } else {
        partCount[z] += c
    }
}
for(let i = 0; i<2000; i++) {
    const line = tophz[i]
    if(line.startsWith('//')) continue;
    const parts = line.split('\t')
    const z = parts[1]
    const count = Number(parts[2])
    if(isDtz(z)) {
        addCount(z, count)
    } else {
        if(chaizi[z]) {
            for(let cz of chaizi[z]) {
                addCount(cz, count)
            }
        } else {
            addCount(z, count)
        }
    }
}

// sort
const parts = []
for(let k in partCount) {
    parts.push([k, partCount[k]])
    parts.sort((a, b) => b[1] - a[1])
}
fs.writeFileSync('top_parts.txt', parts.map(p => p[0] + '\t' + p[1]).join('\n'))