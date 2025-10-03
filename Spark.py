import streamlit as st
from datetime import datetime, date

# Page configuration
st.set_page_config(
    page_title="Chat Spark",
    page_icon="🔥",
    layout="centered"
)

# Custom CSS for styling
st.markdown("""
    <style>
    .main {
        background: linear-gradient(135deg, #f5e6ff 0%, #ffe6f0 100%);
    }
    .stButton>button {
        width: 100%;
        height: 100px;
        font-size: 20px;
        font-weight: bold;
        border-radius: 15px;
        border: none;
        transition: all 0.3s;
    }
    .stButton>button:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    div[data-testid="stMetricValue"] {
        font-size: 3rem;
        font-weight: bold;
    }
    h1 {
        text-align: center;
        color: #7c3aed;
    }
    .subtitle {
        text-align: center;
        color: #6b7280;
        font-size: 1.1rem;
        margin-bottom: 2rem;
    }
    .success-message {
        background: linear-gradient(90deg, #fb923c 0%, #ec4899 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 15px;
        text-align: center;
        font-size: 1.2rem;
        font-weight: bold;
        margin: 1.5rem 0;
        animation: pulse 2s infinite;
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
    }
    .info-box {
        background: white;
        padding: 1.5rem;
        border-radius: 15px;
        margin: 1rem 0;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    </style>
""", unsafe_allow_html=True)

# Initialize session state
if 'spark_data' not in st.session_state:
    st.session_state.spark_data = {
        'user1': {'name': 'Alice', 'clicked_today': False, 'last_click': None},
        'user2': {'name': 'Bob', 'clicked_today': False, 'last_click': None},
        'spark_count': 0,
        'current_streak': 0,
        'longest_streak': 0,
        'last_check_date': date.today()
    }

# Check if it's a new day and reset daily clicks
if st.session_state.spark_data['last_check_date'] != date.today():
    st.session_state.spark_data['user1']['clicked_today'] = False
    st.session_state.spark_data['user2']['clicked_today'] = False
    st.session_state.spark_data['last_check_date'] = date.today()

def get_spark_emoji(streak):
    """Return appropriate flame emoji based on streak"""
    if streak == 0:
        return "🔥"
    elif streak < 3:
        return "🔥"
    elif streak < 7:
        return "🔥🔥"
    elif streak < 14:
        return "🔥🔥🔥"
    else:
        return "🔥🔥🔥🔥"

def handle_user_click(user_key):
    """Handle user click and update spark data"""
    data = st.session_state.spark_data
    
    if data[user_key]['clicked_today']:
        return
    
    # Mark user as clicked
    data[user_key]['clicked_today'] = True
    data[user_key]['last_click'] = datetime.now()
    
    # Check if both users clicked today
    if data['user1']['clicked_today'] and data['user2']['clicked_today']:
        data['spark_count'] += 1
        data['current_streak'] += 1
        data['longest_streak'] = max(data['longest_streak'], data['current_streak'])
    
    st.session_state.spark_data = data

def reset_spark():
    """Reset spark but keep longest streak"""
    longest = st.session_state.spark_data['longest_streak']
    st.session_state.spark_data = {
        'user1': {'name': 'Alice', 'clicked_today': False, 'last_click': None},
        'user2': {'name': 'Bob', 'clicked_today': False, 'last_click': None},
        'spark_count': 0,
        'current_streak': 0,
        'longest_streak': longest,
        'last_check_date': date.today()
    }

# Main UI
st.markdown("<h1>🔥 Chat Spark</h1>", unsafe_allow_html=True)
st.markdown("<p class='subtitle'>Keep your connection alive! Both users click daily to grow the spark</p>", unsafe_allow_html=True)

# Spark display
data = st.session_state.spark_data
spark_emoji = get_spark_emoji(data['current_streak'])

col1, col2, col3 = st.columns([1, 2, 1])
with col2:
    st.markdown(f"<div style='text-align: center; font-size: 6rem;'>{spark_emoji}</div>", unsafe_allow_html=True)

st.markdown("<div class='info-box'>", unsafe_allow_html=True)
col1, col2, col3 = st.columns(3)
with col1:
    st.metric("Total Sparks", data['spark_count'])
with col2:
    st.metric("Current Streak", f"{data['current_streak']} 📅")
with col3:
    st.metric("Longest Streak", f"{data['longest_streak']} 🏆")
st.markdown("</div>", unsafe_allow_html=True)

# Success message
if data['user1']['clicked_today'] and data['user2']['clicked_today']:
    st.markdown(
        "<div class='success-message'>🎉 Both users clicked today! Spark increased! 🔥</div>",
        unsafe_allow_html=True
    )

# User buttons
st.markdown("<br>", unsafe_allow_html=True)
col1, col2 = st.columns(2)

with col1:
    user1 = data['user1']
    button_label = f"👤 {user1['name']}\n{'✓ Clicked today!' if user1['clicked_today'] else 'Click to spark!'}"
    if st.button(button_label, key="user1_btn", disabled=user1['clicked_today'], use_container_width=True):
        handle_user_click('user1')
        st.rerun()

with col2:
    user2 = data['user2']
    button_label = f"👤 {user2['name']}\n{'✓ Clicked today!' if user2['clicked_today'] else 'Click to spark!'}"
    if st.button(button_label, key="user2_btn", disabled=user2['clicked_today'], use_container_width=True):
        handle_user_click('user2')
        st.rerun()

# Reset button
st.markdown("<br>", unsafe_allow_html=True)
if st.button("🔄 Reset Spark (Keep Longest Streak)", use_container_width=True):
    reset_spark()
    st.rerun()

# Info section
st.markdown("<br>", unsafe_allow_html=True)
st.info("💡 **How it works:** Both users must click once daily to increase the spark count! The streak grows when both users click on the same day.")

# Footer
st.markdown("<br><br>", unsafe_allow_html=True)
st.markdown("<p style='text-align: center; color: #9ca3af; font-size: 0.9rem;'>Made with ❤️ using Streamlit</p>", unsafe_allow_html=True)