        let currentOperand = '0';
        let previousOperand = '';
        let operation = undefined;
        let memory = 0;
        let shouldResetScreen = false;

        const currentOperandElement = document.getElementById('current-operand');
        const previousOperandElement = document.getElementById('previous-operand');

        function updateDisplay() {
            currentOperandElement.innerText = formatNumber(currentOperand);
            if (operation != null) {
                previousOperandElement.innerText = `${formatNumber(previousOperand)} ${operation}`;
            } else {
                previousOperandElement.innerText = '';
            }
        }

        function formatNumber(number) {
            const stringNumber = number.toString();
            const integerDigits = parseFloat(stringNumber.split('.')[0]);
            const decimalDigits = stringNumber.split('.')[1];
            let integerDisplay;
            if (isNaN(integerDigits)) {
                integerDisplay = '';
            } else {
                integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
            }
            if (decimalDigits != null) {
                return `${integerDisplay}.${decimalDigits}`;
            } else {
                return integerDisplay;
            }
        }

        function appendNumber(number) {
            if (currentOperand === '0' || shouldResetScreen) {
                currentOperand = number;
                shouldResetScreen = false;
            } else {
                currentOperand = currentOperand.toString() + number.toString();
            }
            updateDisplay();
        }

        function appendDecimal() {
            if (shouldResetScreen) {
                currentOperand = '0';
                shouldResetScreen = false;
            }
            if (currentOperand.includes('.')) return;
            currentOperand = currentOperand + '.';
            updateDisplay();
        }

        function chooseOperator(op) {
            if (currentOperand === '') return;
            if (previousOperand !== '') {
                compute();
            }
            operation = op;
            previousOperand = currentOperand;
            shouldResetScreen = true;
            updateDisplay();
        }

        function compute() {
            let computation;
            const prev = parseFloat(previousOperand);
            const current = parseFloat(currentOperand);
            if (isNaN(prev) || isNaN(current)) return;
            switch (operation) {
                case '+':
                    computation = prev + current;
                    break;
                case '-':
                    computation = prev - current;
                    break;
                case 'x':
                    computation = prev * current;
                    break;
                case '÷':
                    if (current === 0) {
                        alert('Cannot divide by zero!');
                        return;
                    }
                    computation = prev / current;
                    break;
                case 'x^y':
                    computation = Math.pow(prev, current);
                    break;
                default:
                    return;
            }
            currentOperand = computation;
            operation = undefined;
            previousOperand = '';
            shouldResetScreen = true;
            updateDisplay();
        }

        function scientificFunction(func) {
            const current = parseFloat(currentOperand);
            if (isNaN(current) && func !== 'pi' && func !== 'e') return;

            let result;
            switch (func) {
                case 'sin':
                    result = Math.sin(current * Math.PI / 180);
                    break;
                case 'cos':
                    result = Math.cos(current * Math.PI / 180);
                    break;
                case 'tan':
                    result = Math.tan(current * Math.PI / 180);
                    break;
                case 'asin':
                    result = Math.asin(current) * 180 / Math.PI;
                    break;
                case 'acos':
                    result = Math.acos(current) * 180 / Math.PI;
                    break;
                case 'atan':
                    result = Math.atan(current) * 180 / Math.PI;
                    break;
                case 'log':
                    result = Math.log10(current);
                    break;
                case 'ln':
                    result = Math.log(current);
                    break;
                case 'sqrt':
                    result = Math.sqrt(current);
                    break;
                case 'cbrt':
                    result = Math.cbrt(current);
                    break;
                case 'square':
                    result = current * current;
                    break;
                case 'cube':
                    result = current * current * current;
                    break;
                case 'factorial':
                    if (current < 0 || !Number.isInteger(current)) {
                        alert('Factorial requires a non-negative integer');
                        return;
                    }
                    result = 1;
                    for (let i = 2; i <= current; i++) {
                        result *= i;
                    }
                    break;
                case 'power':
                    previousOperand = currentOperand;
                    operation = 'x^y';
                    shouldResetScreen = true;
                    updateDisplay();
                    return;
                case 'pi':
                    result = Math.PI;
                    break;
                case 'e':
                    result = Math.E;
                    break;
                default:
                    return;
            }

            currentOperand = result;
            shouldResetScreen = true;
            updateDisplay();
        }

        function clearAll() {
            currentOperand = '0';
            previousOperand = '';
            operation = undefined;
            updateDisplay();
        }

        function deleteLast() {
            if (currentOperand === '0') return;
            if (currentOperand.length === 1) {
                currentOperand = '0';
            } else {
                currentOperand = currentOperand.toString().slice(0, -1);
            }
            updateDisplay();
        }

        // Memory functions
        function memoryClear() {
            memory = 0;
        }

        function memoryRecall() {
            currentOperand = memory.toString();
            updateDisplay();
        }

        function memoryAdd() {
            memory += parseFloat(currentOperand);
        }

        function memorySubtract() {
            memory -= parseFloat(currentOperand);
        }

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if ((e.key >= 0 && e.key <= 9) || e.key === '.') {
                appendNumber(e.key);
            } else if (e.key === '=' || e.key === 'Enter') {
                compute();
            } else if (e.key === 'Backspace') {
                deleteLast();
            } else if (e.key === 'Escape') {
                clearAll();
            } else if (e.key === '+') {
                chooseOperator('+');
            } else if (e.key === '-') {
                chooseOperator('-');
            } else if (e.key === '*') {
                chooseOperator('x');
            } else if (e.key === '/') {
                chooseOperator('÷');
            }
        });

        const installButton = document.getElementById('install-btn');
        let deferredInstallPrompt = null;

        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            deferredInstallPrompt = event;
            if (installButton) {
                installButton.style.display = 'block';
            }
        });

        if (installButton) {
            installButton.addEventListener('click', async () => {
                if (!deferredInstallPrompt) return;
                deferredInstallPrompt.prompt();
                const choiceResult = await deferredInstallPrompt.userChoice;
                deferredInstallPrompt = null;
                if (choiceResult.outcome === 'accepted') {
                    installButton.style.display = 'none';
                }
            });
        }

        window.addEventListener('appinstalled', () => {
            if (installButton) {
                installButton.style.display = 'none';
            }
        });

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', async () => {
                try {
                    await navigator.serviceWorker.register('service-worker.js');
                } catch (error) {
                    console.error('Service worker registration failed:', error);
                }
            });
        }
