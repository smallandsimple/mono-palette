'use strict'

let activeHue = 0
let activeSaturation = 0

// Fulfills Requirement
function getRandInt(max = 100, min = 0) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

// Fulfills Requirement
async function fetchPresets() {
    const response = await fetch('../json/presets.json')
    const json = await response.json()
    return json.colors
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

// Fulfills Requirement
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

// Fulfills Requirement
function generateRandomPalette() {
    const h = activeHue = getRandInt(359, 0)
    const s = activeSaturation = getRandInt()
    setHueAndSaturation(h, s)
    updateBackgroundColor()
    updateSelectedFormula()
}

// --------------------------------------------------------------------------------

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

function updateSelectedFormula(l = 50) {
    const selectedFormula = document.querySelector('.hsl-formula')
    selectedFormula.value = `hsl(${activeHue}, ${activeSaturation}%, ${l}%)`

    if (l < 50) {
        selectedFormula.classList.add('text-L90')
    } else {
        selectedFormula.classList.remove('text-L90')
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