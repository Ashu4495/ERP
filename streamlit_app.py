import streamlit as st
import os
import streamlit.components.v1 as components

# --- Page Configuration ---
st.set_page_config(
    page_title="Campus 360 ERP App Container",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# --- CSS Overrides ---
st.markdown("""
<style>
    .main .block-container {
        padding: 0px;
        max-width: 100%;
    }
    header { visibility: hidden; }
</style>
""", unsafe_allow_html=True)

# --- App Logic ---
st.title("🎓 Campus 360 ERP | SIH Prototype")

st.info("💡 To deploy the full React application on Streamlit, first build the production assets (npm run build) then serve them via a static server or use this container to view documentation.")

# Sidebar for navigation
with st.sidebar:
    st.header("ERP Modules")
    st.markdown("- [Student Portal](#)")
    st.markdown("- [Admission Management](#)")
    st.markdown("- [Library Tracking](#)")
    st.markdown("- [AICTE Dashboard](#)")
    st.divider()
    st.write("v1.0.0-Beta")

# Component Placeholder
st.warning("⚠️ Note: Streamlit is primarily for Data Apps. Your React ERP is being built and prepared for production deployment. This script acts as a deployment wrapper.")

# Mock data visualization (Streamlit style)
st.subheader("Current Admissions Analytics")
col1, col2, col3 = st.columns(3)
col1.metric("Total Students", "4,250", "+12%")
col2.metric("Active Courses", "48", "Stable")
col3.metric("Library Books", "12,400", "+850")

# If user has a built 'dist' folder, show options to view or download static site.
if os.path.exists("dist"):
    st.success("✅ Build artifacts found! You can serve the 'dist' folder using a static file server.")
else:
    st.button("Trigger Production Build (npm run build)", disabled=True)

st.write("---")
st.caption("Powered by React + Streamlit Deployment Bridge")
