// AddPolicy.js
import React from "react";
import { Box, Typography, Paper } from "@mui/material";

const CategoryBox = ({ category, onClick }) => (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      m: 2,
      width: "calc(40% - 24px)",
      cursor: "pointer",
      textAlign: "center",
      "&:hover": {
        backgroundColor: "#e0e0e0",
      },
    }}
    onClick={() => onClick(category)}>
    <Typography variant="h5">{category}</Typography>
  </Paper>
);

const PolicyBox = ({ policy, onClick }) => (
  <Paper
    elevation={3}
    sx={{ p: 2, m: 1, cursor: "pointer", textAlign: "center" }}
    onClick={() => onClick(policy)}>
    <Typography variant="h6">{policy.name}</Typography>
    <Typography>Sum Assured: {policy.sum_assured}</Typography>
  </Paper>
);

const PremiumPlanBox = ({ plan, onClick }) => (
  <Paper
    elevation={3}
    sx={{ p: 2, m: 1, cursor: "pointer", textAlign: "center" }}
    onClick={() => onClick(plan)}>
    <Typography variant="h6">{plan.duration}</Typography>
    <Typography>Premium: {plan.premium}</Typography>
  </Paper>
);

const AddPolicy = ({
  categories,
  policies,
  selectedCategory,
  selectedPolicy,
  onCategorySelect,
  onPolicySelect,
  onPremiumPlanSelect,
}) => (
  <Box>
    <Typography variant="h5">Add Policy</Typography>
    {!selectedCategory ? (
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {categories.map((category, index) => (
          <CategoryBox
            key={index}
            category={category}
            onClick={onCategorySelect}
          />
        ))}
      </Box>
    ) : !selectedPolicy ? (
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {policies
          .filter((policy) => policy.category === selectedCategory)
          .map((policy, index) => (
            <PolicyBox key={index} policy={policy} onClick={onPolicySelect} />
          ))}
      </Box>
    ) : (
      <Box display="flex" flexWrap="wrap" justifyContent="center">
        {selectedPolicy.premium_plans.map((plan, index) => (
          <PremiumPlanBox
            key={index}
            plan={plan}
            onClick={onPremiumPlanSelect}
          />
        ))}
      </Box>
    )}
  </Box>
);

export default AddPolicy;
