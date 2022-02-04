'use strict'

let activeHue = 0
let activeSaturation = 0

function getRandInt(max = 100, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

async function fetchPresets() {
    try {
        const response = await fetch('/alan/hsl/json/presets.json')
        const json = await response.json()
        return json.colors
    } catch {
        return [[0, 0], [0, 80], [30, 80], [60, 80], [90, 80], [120, 80], [150, 80], [180, 80], [210, 80], [240, 80], [270, 80], [300, 80], [330, 80]]
    }
}

function renderPresets(presets) {
    const presetsList = document.querySelector('.presets-list')

    for (const [h, s] of presets) {
        const preset = document.createElement('li')
        preset.innerHTML = `<span style="color:hsl(${h}, ${s}%, 50%)">■</span>`
        presetsList.appendChild(preset)
        preset.addEventListener('click', () => {
            setHueAndSaturation(h, s)
            updateSelectedFormula()
            updateBackgroundColor()
        })
    }
}

function renderColorBlocks() {
    const colorBlockContainer = document.querySelector('.color-block-container')
    const colorBlocks = []
    for (let i = 10; i < 100; i += 10) {
        const block = document.createElement('button')
        const l = i
        block.id = 'L' + i
        block.className = 'color-block'
        block.addEventListener('click', () => updateBackgroundColor(l))
        colorBlocks.push(block)
    }
    colorBlockContainer.append(...colorBlocks)
}

function generateRandomPalette() {
    const h = activeHue = getRandInt(359, 0)
    const s = activeSaturation = getRandInt()
    setHueAndSaturation(h, s)
    updateBackgroundColor()
    updateSelectedFormula()
}

function setHueAndSaturation(h, s) {
    activeHue = h
    activeSaturation = s
    document.documentElement.style.setProperty('--hue', h)
    document.documentElement.style.setProperty('--saturation', s + '%')
}

function updateBackgroundColor(l = 50) {
    document.body.style.setProperty('background', `var(--color-L${l})`)
    updateSelectedFormula(l)
}

const rgbToHex = function (r, g, b) {
    return [r, g, b].map(n => {
        const hex = n.toString(16).toUpperCase()
        return n > 15 ? hex : `0${hex}`
    }).join('')
}

function updateSelectedFormula(l = 50) {
    const hslFormula = document.querySelector('.hsl-formula')
    const rgbFormula = document.querySelector('.rgb-formula')
    const hexFormula = document.querySelector('.hex-formula')
    const rgb = window.getComputedStyle(document.body).getPropertyValue('background-color').replace(/[rgb\(\),]/g,'').split(' ').map(n => +n)
    const hex = rgbToHex(...rgb)

    hslFormula.value = `hsl(${activeHue}, ${activeSaturation}%, ${l}%)`
    rgbFormula.value = `rgb(${rgb.join(', ')})`
    hexFormula.value = `#${hex}`

    if (l < 50) {
        hslFormula.classList.add('text-L90')
        rgbFormula.classList.add('text-L90')
        hexFormula.classList.add('text-L90')
    } else {
        hslFormula.classList.remove('text-L90')
        rgbFormula.classList.remove('text-L90')
        hexFormula.classList.remove('text-L90')
    }
}

async function run(){
    const presets = await fetchPresets()
    renderPresets(presets)
    renderColorBlocks()

    document.querySelector('.btn-generate').addEventListener('click', generateRandomPalette)
    generateRandomPalette()

    const presetsList = document.querySelector('.presets-list')
    document.querySelector('.presets-button').addEventListener('click', () => {
        presetsList.classList.toggle('visible')
    })
}

run()