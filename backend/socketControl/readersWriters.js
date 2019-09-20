
let { Semaphore } = require("./semaphore");

function RW() {

    readerCounter = 0;
    readerCounterMutex = new Semaphore(1);
    writerMutex = new Semaphore(1);


    this.startWrite = async function(){
        await writerMutex.acquire();
    }
    this.endWrite = function(){
        writerMutex.release();
    }
    this.startRead = async function(){
        await readerCounterMutex.acquire();
            if(++readerCounter == 1)
                await writerMutex.acquire();
        readerCounterMutex.release();
    }
    this.endRead = async function(){
        await readerCounterMutex.acquire();
            if(--readerCounter == 0)
                writerMutex.release();
        readerCounterMutex.release();
    }

}

module.exports = { RW };