/*
 * QMC5883.h
 *
 *  Created on: 11 May 2021
 *      Author: Serdar
 */

#ifndef QMC5883_H_
#define QMC5883_H_
//#########################################################################################################
#ifdef __cplusplus
extern "C" {
#endif
//#########################################################################################################
#include "main.h"
#include "stm32f1xx.h"
//#########################################################################################################
#define Standby 0
#define Continuous 1
#define QMC_OK 0
#define QMC_FALSE 1
#define compassAddress 0x1A
#define offset 0
//#########################################################################################################

typedef struct QMC {
    I2C_HandleTypeDef *i2c;
    uint8_t Control_Register;
    uint8_t datas[6];
    int16_t Xaxis;
    int16_t Yaxis;
    int16_t Zaxis;
    int16_t Xmax;
    int16_t Xmin;
    int16_t Ymax;
    int16_t Ymin;
    int16_t Zmax;
    int16_t Zmin;
    float heading;
    float compas;
    int8_t bearing;
} QMC_t;
//#########################################################################################################
uint8_t QMC_init(QMC_t *qmc, I2C_HandleTypeDef *i2c, uint8_t Output_Data_Rate);
uint8_t QMC_read(QMC_t *qmc);
float QMC_readHeading(QMC_t *qmc);
uint8_t QMC_Standby(QMC_t *qmc);
uint8_t QMC_Reset(QMC_t *qmc);
uint8_t QMC_getBearing(QMC_t *qmc);
void setQMCAddr(uint8_t addr);
//#########################################################################################################
#ifdef __cplusplus
}
#endif
#endif /* QMC5883_H_ */