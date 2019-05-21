const {  fahrenheitToCelsius, celsiusToFahrenheit} = require('../src/math')

test('testFahrenheitToCelsius', () => {
    const celcius = fahrenheitToCelsius(32)
    expect(celcius).toBe(0)
})


test('testCelsiusToFahrenheit', () => {
    const fahrenheit = celsiusToFahrenheit(0)
    expect(fahrenheit).toBe(32)
})