import React, { useEffect, useState } from 'react';
import { createCalculation } from '../api/graphql/calculation'

import {
    Box, 
    Button, 
    Form,
    FormField, 
    Heading,
    TextInput,
    Text
} from 'grommet';

import {
    Services as ServicesIcon
} from 'grommet-icons'

import Loader from '../components/loader'

const Home = () => {
    const [calculationData, setCalculationData] = useState()
    const [result, setResult] = useState({ fetched: null, isFetching: false })

    const submit = () => {
        console.log(calculationData)
        try {
            setResult({ fetched: null, isFetching: true })
            let creation_date = new Date()
            let acting_list = []
            Object.keys(calculationData).map(key => {
                if(
                    key === "acting-1" ||
                    key === "acting-2" ||
                    key === "acting-3"
                ) {
                    if(calculationData[key] !== "") {
                        acting_list.push(parseInt(calculationData[key]))
                    }
                }
            })

            const payload = {
                creation_date: creation_date.toISOString(),
                used_budget: parseFloat(calculationData.budget),
                acting: acting_list,
                directing: parseInt(calculationData.directing),
                companies: parseInt(calculationData.company)
            }

            createCalculation(payload)
                .then(res => {
                    if(res) {
                        console.log(res)
                        setResult({ fetched: res.createCalculation.calculation, isFetching: false })
                    } else {
                        setResult({ fetched: null, isFetching: false })
                    }
                })
        } catch(e) {
            console.error(e)
            setResult({ fetched: null, isFetching: false })
        }
    }

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    return (
        <Box height="91vh" align="center">
            <Box 
                width="large" 
                direction="column"
                align="center"
            >
                <Heading level="2">Revenue Calculator</Heading>
                <Box fill="horizontal" pad="medium">
                    <Form
                        onChange={(value) => {
                            setCalculationData(value)
                        }}
                        onSubmit={() => submit()}
                    >
                        <Heading margin="none" level="4">Budget</Heading>
                        <FormField name="budget" width="medium" required>
                            <TextInput 
                                name="budget" 
                                type="number"
                            />
                        </FormField>
                        <Heading margin="none" level="4">Acting</Heading>
                        <FormField name="acting-1" width="medium" label="ActingID" required>
                            <TextInput 
                                name="acting-1"
                                type="number"
                            />
                        </FormField>
                        <FormField name="acting-2" width="medium">
                            <TextInput 
                                name="acting-2"
                                type="number"
                            />
                        </FormField>
                        <FormField name="acting-3" width="medium">
                            <TextInput 
                                name="acting-3"
                                type="number"
                            />
                        </FormField>
                        <Heading margin="none" level="4">Directing</Heading>
                        <FormField name="directing" width="medium" label="DirectingID" required>
                            <TextInput 
                                name="directing"
                                type="number"
                            />
                        </FormField>
                        <Heading margin="none" level="4">Company</Heading>
                        <FormField name="company" width="medium" label="CompanyID" required>
                            <TextInput 
                                name="company"
                                type="number"
                            />
                        </FormField>
                        <Box fill="horizontal" direction="row" justify="center" pad={{vertical: "small"}}>
                            {result.isFetching ? (
                                <Loader size="component"/>
                            ) : (
                                <Button 
                                    primary
                                    reverse
                                    type="submit"
                                    label="Create Calculation"
                                    icon={<ServicesIcon />}
                                />
                            )}
                        </Box>
                        {result.fetched && (
                            <Box>
                                <Heading level="3" margin="none">Calculated Revenue: {formatNumber(result.fetched.calculatedRevenue)}$</Heading>
                            </Box>
                        )}
                    </Form>
                </Box>
            </Box>
        </Box>
    )
}

export default Home;