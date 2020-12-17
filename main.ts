
/**
 * 识别手势
 */
//% weight=100 color=#0fbc11 icon=""
namespace Grs {
    
    function PAJ7620_VAL(val: number, maskbit: number): number{
        return val << maskbit;
    }

    const PAJ7620_ADDR_BASE = 0x00;

    // REGISTER BANK SELECT
    const PAJ7620_REGITER_BANK_SEL = (PAJ7620_ADDR_BASE + 0xEF);	//W

    // DEVICE ID
    const PAJ7620_ID = 0x73;

    // REGISTER BANK 0
    const PAJ7620_ADDR_SUSPEND_CMD = (PAJ7620_ADDR_BASE + 0x3);	//W
    const PAJ7620_ADDR_GES_PS_DET_MASK_0 = (PAJ7620_ADDR_BASE + 0x41);	//RW
    const PAJ7620_ADDR_GES_PS_DET_MASK_1 = (PAJ7620_ADDR_BASE + 0x42);	//RW
    const PAJ7620_ADDR_GES_PS_DET_FLAG_0 = (PAJ7620_ADDR_BASE + 0x43);	//R
    const PAJ7620_ADDR_GES_PS_DET_FLAG_1 = (PAJ7620_ADDR_BASE + 0x44);	//R
    const PAJ7620_ADDR_STATE_INDICATOR = (PAJ7620_ADDR_BASE + 0x45);	//R
    const PAJ7620_ADDR_PS_HIGH_THRESHOLD = (PAJ7620_ADDR_BASE + 0x69);	//RW
    const PAJ7620_ADDR_PS_LOW_THRESHOLD = (PAJ7620_ADDR_BASE + 0x6A);	//RW
    const PAJ7620_ADDR_PS_APPROACH_STATE = (PAJ7620_ADDR_BASE + 0x6B);	//R
    const PAJ7620_ADDR_PS_RAW_DATA = (PAJ7620_ADDR_BASE + 0x6C);	//R

    // REGISTER BANK 1
    const PAJ7620_ADDR_PS_GAIN = (PAJ7620_ADDR_BASE + 0x44);	//RW
    const PAJ7620_ADDR_IDLE_S1_STgeEP_0 = (PAJ7620_ADDR_BASE + 0x67);	//RW
    const PAJ7620_ADDR_IDLE_S1_STEP_1 = (PAJ7620_ADDR_BASE + 0x68);	//RW
    const PAJ7620_ADDR_IDLE_S2_STEP_0 = (PAJ7620_ADDR_BASE + 0x69);	//RW
    const PAJ7620_ADDR_IDLE_S2_STEP_1 = (PAJ7620_ADDR_BASE + 0x6A);	//RW
    const PAJ7620_ADDR_OP_TO_S1_STEP_0 = (PAJ7620_ADDR_BASE + 0x6B);	//RW
    const PAJ7620_ADDR_OP_TO_S1_STEP_1 = (PAJ7620_ADDR_BASE + 0x6C);	//RW
    const PAJ7620_ADDR_OP_TO_S2_STEP_0 = (PAJ7620_ADDR_BASE + 0x6D);	//RW
    const PAJ7620_ADDR_OP_TO_S2_STEP_1 = (PAJ7620_ADDR_BASE + 0x6E);	//RW
    const PAJ7620_ADDR_OPERATION_ENABLE = (PAJ7620_ADDR_BASE + 0x72);	//RW

    // PAJ7620_REGITER_BANK_SEL
    const PAJ7620_BANK0 = PAJ7620_VAL(0,0);
    const PAJ7620_BANK1 = PAJ7620_VAL(1,0);

    // PAJ7620_ADDR_SUSPEND_CMD
    const PAJ7620_I2C_WAKEUP = PAJ7620_VAL(1,0);
    const PAJ7620_I2C_SUSPEND = PAJ7620_VAL(0,0);

    // PAJ7620_ADDR_OPERATION_ENABLE
    const PAJ7620_ENABLE = PAJ7620_VAL(1,0);
    const PAJ7620_DISABLE = PAJ7620_VAL(0,0);

    export enum bank_e {
        BANK0 = 0,
        BANK1 = 1
    }

    const GES_RIGHT_FLAG = PAJ7620_VAL(1,0);
    const GES_LEFT_FLAG = PAJ7620_VAL(1,1);
    const GES_UP_FLAG = PAJ7620_VAL(1,2);
    const GES_DOWN_FLAG = PAJ7620_VAL(1,3);
    const GES_FORWARD_FLAG = PAJ7620_VAL(1,4);
    const GES_BACKWARD_FLAG = PAJ7620_VAL(1,5);
    const GES_CLOCKWISE_FLAG = PAJ7620_VAL(1,6);
    const GES_COUNT_CLOCKWISE_FLAG = PAJ7620_VAL(1,7);
    const GES_WAVE_FLAG = PAJ7620_VAL(1,0);


    const DELAY  = 150;//I2C之间延时间隔ms

    const GES_REACTION_TIME = 500;				// You can adjust the reaction time according to the actual circumstance.
    const GES_ENTRY_TIME = 800;				// When you want to recognize the Forward/Backward gestures, your gestures' reaction time must less than GES_ENTRY_TIME(0.8s). 
    const GES_QUIT_TIME = 1000;

    function paj7620WriteReg(addr: number, cmd: number): void{
        let buff = pins.createBuffer(2);
        buff[0] = addr;
        buff[1] = cmd;
        pins.i2cWriteBuffer(PAJ7620_ID, buff);
        basic.pause(DELAY);
    }
    
    
	function paj7620ReadReg(addr: number, qty: number): number{
        let error;
        let buff = pins.createBuffer(1);
        buff[0] = addr;
        pins.i2cWriteBuffer(PAJ7620_ID, buff);
        basic.pause(DELAY);

        let result = pins.i2cReadNumber(PAJ7620_ID, NumberFormat.UInt8LE, false);
        return result;
    }
    

	function paj7620SelectBank(bank: bank_e): void{
		switch(bank){
			case bank_e.BANK0:
				paj7620WriteReg(PAJ7620_REGITER_BANK_SEL, PAJ7620_BANK0);
				break;
			case bank_e.BANK1:
				paj7620WriteReg(PAJ7620_REGITER_BANK_SEL, PAJ7620_BANK1);
				break;
			default:
				break;
		}
    }

    //%block
    export function right(): number{
        return GES_RIGHT_FLAG;
    }

    //%block
    export function left(): number{
        return GES_LEFT_FLAG;
    }

    //%block
    export function up(): number{
        return GES_UP_FLAG;
    }

    //%block
    export function down(): number{
        return GES_DOWN_FLAG;
    }

    //%block
    export function forward(): number{
        return GES_FORWARD_FLAG;
    }

    //%block
    export function backward(): number{
        return GES_BACKWARD_FLAG;
    }


    /** 
     * TODO: 在此处描述您的函数
     */
    //% block
    export function readGesture(): number{
        let data = 0, data1 = 0, error;
		data = paj7620ReadReg(0x43, 1);				// Read Bank_0_Reg_0x43/0x44 for gesture result.

        switch (data) 									// When different gestures be detected, the variable 'data' will be set to different values by paj7620ReadReg(0x43, 1, &data).
        {
            case GES_RIGHT_FLAG:
                basic.pause(GES_ENTRY_TIME);
                data = paj7620ReadReg(0x43, 1);
                if(data == GES_FORWARD_FLAG) 
                {
                    basic.pause(GES_QUIT_TIME);
                    return GES_FORWARD_FLAG;
                }
                else if(data == GES_BACKWARD_FLAG) 
                {
                    basic.pause(GES_QUIT_TIME);
                    return GES_BACKWARD_FLAG;
                }
                else
                {
                    return GES_RIGHT_FLAG;
                }
            case GES_LEFT_FLAG: 
                basic.pause(GES_ENTRY_TIME);
                data = paj7620ReadReg(0x43, 1);
                if(data == GES_FORWARD_FLAG) 
                {
                    basic.pause(GES_QUIT_TIME);
                    return GES_FORWARD_FLAG;
                }
                else if(data == GES_BACKWARD_FLAG) 
                {
                    basic.pause(GES_QUIT_TIME);
                    return GES_BACKWARD_FLAG;
                }
                else
                {
                    return GES_LEFT_FLAG;
                }
            case GES_UP_FLAG:
                basic.pause(GES_ENTRY_TIME);
                data = paj7620ReadReg(0x43, 1);
                if(data == GES_FORWARD_FLAG) 
                {
                    basic.pause(GES_QUIT_TIME);
                    return GES_FORWARD_FLAG;
                }
                else if(data == GES_BACKWARD_FLAG) 
                {
                    basic.pause(GES_QUIT_TIME);
                    return GES_BACKWARD_FLAG;
                }
                else
                {
                    return GES_UP_FLAG;
                }
            case GES_DOWN_FLAG:
                basic.pause(GES_ENTRY_TIME);
                data = paj7620ReadReg(0x43, 1);
                if(data == GES_FORWARD_FLAG) 
                {
                    basic.pause(GES_QUIT_TIME);
                    return GES_FORWARD_FLAG;
                }
                else if(data == GES_BACKWARD_FLAG) 
                {
                    basic.pause(GES_QUIT_TIME);
                    return GES_BACKWARD_FLAG;
                }
                else
                {
                    return GES_DOWN_FLAG;
                }
            case GES_FORWARD_FLAG:
                basic.pause(GES_QUIT_TIME);
                return GES_FORWARD_FLAG;
            case GES_BACKWARD_FLAG:		  
                basic.pause(GES_QUIT_TIME);
                return GES_BACKWARD_FLAG;
            case GES_CLOCKWISE_FLAG:
                return GES_CLOCKWISE_FLAG;
            case GES_COUNT_CLOCKWISE_FLAG:
                return GES_COUNT_CLOCKWISE_FLAG;
            default:
                data1 = paj7620ReadReg(0x44, 1);
                if (data1 == GES_WAVE_FLAG) 
                {
                    return GES_WAVE_FLAG;
                }
        }
        basic.pause(100);
		return 0;
    }

    
    /** 
     * TODO: 初始化手势识别传感器
     */
    //% block
    export function initSensor(): number{
        let i = 0;
		let error;
		let data0 = 0, data1 = 0;
		//wakeup the sensor
		basic.pause(700);	//Wait 700us for PAJ7620U2 to stabilize	

		paj7620SelectBank(bank_e.BANK0);
		paj7620SelectBank(bank_e.BANK0);

		data0 = paj7620ReadReg(0, 1);
        data1 = paj7620ReadReg(1, 1);
        if (data0 != 0x20 )
        {
            return data0;
        }
        if (data1 != 0x76)
        {
            return data1;
        }

        let initRegisterArray_1 = [	// Initial Gesture
            [0xEF,0x00],
            [0x32,0x29],
            [0x33,0x01],
            [0x34,0x00],
            [0x35,0x01],
            [0x36,0x00],
            [0x37,0x07],
            [0x38,0x17],
            [0x39,0x06],
            [0x3A,0x12],
            [0x3F,0x00],
            [0x40,0x02],
            [0x41,0xFF],
            [0x42,0x01],
            [0x46,0x2D],
            [0x47,0x0F],
            [0x48,0x3C],
            [0x49,0x00],
            [0x4A,0x1E],
            [0x4B,0x00],
            [0x4C,0x20],
            [0x4D,0x00],
            [0x4E,0x1A],
            [0x4F,0x14],
            [0x50,0x00],
            [0x51,0x10],
            [0x52,0x00],
            [0x5C,0x02],
            [0x5D,0x00],
            [0x5E,0x10],
            [0x5F,0x3F],
            [0x60,0x27],
            [0x61,0x28],
            [0x62,0x00],
            [0x63,0x03],
            [0x64,0xF7],
            [0x65,0x03],
            [0x66,0xD9],
            [0x67,0x03],
            [0x68,0x01],
            [0x69,0xC8],
            [0x6A,0x40],
            [0x6D,0x04],
            [0x6E,0x00],
            [0x6F,0x00],
            [0x70,0x80],
            [0x71,0x00],
            [0x72,0x00],
            [0x73,0x00],
            [0x74,0xF0],
            [0x75,0x00],
            [0x80,0x42],
            [0x81,0x44],
            [0x82,0x04],
            [0x83,0x20],
            [0x84,0x20],
            [0x85,0x00],
            [0x86,0x10],
            [0x87,0x00],
            [0x88,0x05],
            [0x89,0x18],
            [0x8A,0x10],
            [0x8B,0x01],
            [0x8C,0x37],
            [0x8D,0x00],
            [0x8E,0xF0],
            [0x8F,0x81],
            [0x90,0x06],
            [0x91,0x06],
            [0x92,0x1E],
            [0x93,0x0D],
            [0x94,0x0A],
            [0x95,0x0A],
            [0x96,0x0C],
            [0x97,0x05],
            [0x98,0x0A],
            [0x99,0x41],
            [0x9A,0x14],
            [0x9B,0x0A],
            [0x9C,0x3F],
            [0x9D,0x33],
            [0x9E,0xAE],
            [0x9F,0xF9],
            [0xA0,0x48],
            [0xA1,0x13],
            [0xA2,0x10],
            [0xA3,0x08],
            [0xA4,0x30],
            [0xA5,0x19],
            [0xA6,0x10],
            [0xA7,0x08],
            [0xA8,0x24],
            [0xA9,0x04],
            [0xAA,0x1E],
            [0xAB,0x1E],
            [0xCC,0x19],
            [0xCD,0x0B],
            [0xCE,0x13],
            [0xCF,0x64],
            [0xD0,0x21],
            [0xD1,0x0F],
            [0xD2,0x88],
            [0xE0,0x01],
            [0xE1,0x04],
            [0xE2,0x41],
            [0xE3,0xD6],
            [0xE4,0x00],
            [0xE5,0x0C],
            [0xE6,0x0A],
        ];
        let len = initRegisterArray_1.length;
        for (i = 0; i < len; i++)
        {
            let data = initRegisterArray_1.shift();
            paj7620WriteReg(data[0], data[1]);
            data.shift();
            data.shift();
        }
        initRegisterArray_1 = [
            [0xE7,0x00],
            [0xE8,0x00],
            [0xE9,0x00],
            [0xEE,0x07],
            [0xEF,0x01],
            [0x00,0x1E],
            [0x01,0x1E],
            [0x02,0x0F],
            [0x03,0x10],
            [0x04,0x02],
            [0x05,0x00],
            [0x06,0xB0],
            [0x07,0x04],
            [0x08,0x0D],
            [0x09,0x0E],
            [0x0A,0x9C],
            [0x0B,0x04],
            [0x0C,0x05],
            [0x0D,0x0F],
            [0x0E,0x02],
            [0x0F,0x12],
            [0x10,0x02],
            [0x11,0x02],
            [0x12,0x00],
            [0x13,0x01],
            [0x14,0x05],
            [0x15,0x07],
            [0x16,0x05],
            [0x17,0x07],
            [0x18,0x01],
            [0x19,0x04],
            [0x1A,0x05],
            [0x1B,0x0C],
            [0x1C,0x2A],
            [0x1D,0x01],
            [0x1E,0x00],
            [0x21,0x00],
            [0x22,0x00],
            [0x23,0x00],
            [0x25,0x01],
            [0x26,0x00],
            [0x27,0x39],
            [0x28,0x7F],
            [0x29,0x08],
            [0x30,0x03],
            [0x31,0x00],
            [0x32,0x1A],
            [0x33,0x1A],
            [0x34,0x07],
            [0x35,0x07],
            [0x36,0x01],
            [0x37,0xFF],
            [0x38,0x36],
            [0x39,0x07],
            [0x3A,0x00],
            [0x3E,0xFF],
            [0x3F,0x00],
            [0x40,0x77],
            [0x41,0x40],
            [0x42,0x00],
            [0x43,0x30],
            [0x44,0xA0],
            [0x45,0x5C],
            [0x46,0x00],
            [0x47,0x00],
            [0x48,0x58],
            [0x4A,0x1E],
            [0x4B,0x1E],
            [0x4C,0x00],
            [0x4D,0x00],
            [0x4E,0xA0],
            [0x4F,0x80],
            [0x50,0x00],
            [0x51,0x00],
            [0x52,0x00],
            [0x53,0x00],
            [0x54,0x00],
            [0x57,0x80],
            [0x59,0x10],
            [0x5A,0x08],
            [0x5B,0x94],
            [0x5C,0xE8],
            [0x5D,0x08],
            [0x5E,0x3D],
            [0x5F,0x99],
            [0x60,0x45],
            [0x61,0x40],
            [0x63,0x2D],
            [0x64,0x02],
            [0x65,0x96],
            [0x66,0x00],
            [0x67,0x97],
            [0x68,0x01],
            [0x69,0xCD],
            [0x6A,0x01],
            [0x6B,0xB0],
            [0x6C,0x04],
            [0x6D,0x2C],
            [0x6E,0x01],
            [0x6F,0x32],
            [0x71,0x00],
            [0x72,0x01],
            [0x73,0x35],
            [0x74,0x00],
            [0x75,0x33],
            [0x76,0x31],
            [0x77,0x01],
            [0x7C,0x84],
            [0x7D,0x03],
            [0x7E,0x01],
        ]
        len = initRegisterArray_1.length;
        for (i = 0; i < len; i++)
        {
            let data = initRegisterArray_1.shift();
            paj7620WriteReg(data[0], data[1]);
            data.shift();
            data.shift();
        }
        basic.showString("su");

		basic.pause(DELAY);
		paj7620SelectBank(bank_e.BANK0);  //gesture flage reg in Bank0
		
		return 0;
    }
}
